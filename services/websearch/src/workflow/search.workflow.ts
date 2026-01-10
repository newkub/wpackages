import { Effect } from "effect";
import { randomUUID } from "node:crypto";
import { SearchHistoryEntry, SearchMetric, SearchQuery, SearchQuerySchema, SearchWorkflowEvent } from "../types";
import {
	QueryEnhancementService,
	ResultSummarizationService,
	SearchHistoryService,
	AnalyticsService,
	SearchService,
	TopicClusteringService,
} from "../services";

export class SearchWorkflow {
	constructor(
		private searchService: SearchService,
		private queryEnhancer: QueryEnhancementService,
		private resultSummarizer: ResultSummarizationService,
		private topicClusterer: TopicClusteringService,
		private historyService: SearchHistoryService,
		private analyticsService: AnalyticsService,
	) {}

	search(query: SearchQuery | string): Effect.Effect<unknown, Error> {
		return Effect.gen(this, function*() {
			const parsedQuery = typeof query === "string"
				? SearchQuerySchema.parse({ query })
				: SearchQuerySchema.parse(query);

			const enhancement = yield* this.queryEnhancer.enhance(parsedQuery);
			const searchResponse = yield* this.searchService.search(parsedQuery);
			const summary = yield* this.resultSummarizer.summarize(searchResponse.results, 1000, 5);
			const clusters = yield* this.topicClusterer.cluster(searchResponse.results, 10);

			yield* this.recordHistoryAndAnalytics(searchResponse);

			return {
				query: searchResponse.query,
				enhancement,
				results: searchResponse.results,
				summary,
				clusters,
				metadata: {
					totalResults: searchResponse.totalResults,
					enginesUsed: searchResponse.enginesUsed,
					searchTime: searchResponse.searchTime,
					cached: searchResponse.cached,
				},
			};
		});
	}

	searchWithProgress(
		query: SearchQuery | string,
		options?: { onProgress?: (event: SearchWorkflowEvent) => void },
	): Effect.Effect<unknown, Error> {
		const workflowStartAt = Date.now();

		return Effect.gen(this, function*() {
			const parsedQuery = typeof query === "string"
				? SearchQuerySchema.parse({ query })
				: SearchQuerySchema.parse(query);

			const onProgress = options?.onProgress;

			yield* Effect.sync(() => {
				onProgress?.({ type: "workflow:start", at: new Date().toISOString(), query: parsedQuery.query });
			});

			const enhancement = yield* this.runStage(
				"enhance",
				() => this.queryEnhancer.enhance(parsedQuery),
				onProgress,
			);

			const searchResponse = yield* this.runStage(
				"search",
				() => this.searchService.searchWithProgress(parsedQuery, {
					onProgress: (event) => onProgress?.(event),
				}),
				onProgress,
			);

			const summary = yield* this.runStage(
				"summarize",
				() => this.resultSummarizer.summarize(searchResponse.results, 1000, 5),
				onProgress,
			);

			const clusters = yield* this.runStage(
				"cluster",
				() => this.topicClusterer.cluster(searchResponse.results, 10),
				onProgress,
			);

			yield* this.recordHistoryAndAnalytics(searchResponse);

			yield* Effect.sync(() => {
				onProgress?.({
					type: "workflow:complete",
					at: new Date().toISOString(),
					durationMs: Date.now() - workflowStartAt,
				});
			});

			return {
				query: searchResponse.query,
				enhancement,
				results: searchResponse.results,
				summary,
				clusters,
				metadata: {
					totalResults: searchResponse.totalResults,
					enginesUsed: searchResponse.enginesUsed,
					searchTime: searchResponse.searchTime,
					cached: searchResponse.cached,
				},
			};
		}).pipe(
			Effect.tapError((error: Error) =>
				Effect.sync(() => {
					options?.onProgress?.({
						type: "workflow:error",
						at: new Date().toISOString(),
						durationMs: Date.now() - workflowStartAt,
						error: error.message,
					});
				})
			),
		);
	}

	private runStage<T>(
		stage: "enhance" | "search" | "summarize" | "cluster",
		effect: () => Effect.Effect<T, Error>,
		onProgress?: (event: SearchWorkflowEvent) => void,
	): Effect.Effect<T, Error> {
		const stageStartedAt = Date.now();

		return Effect.sync(() => {
			onProgress?.({ type: "workflow:stage:start", at: new Date().toISOString(), stage });
		}).pipe(
			Effect.flatMap(() => effect()),
			Effect.tap(() =>
				Effect.sync(() => {
					onProgress?.({
						type: "workflow:stage:success",
						at: new Date().toISOString(),
						stage,
						durationMs: Date.now() - stageStartedAt,
					});
				})
			),
			Effect.tapError((error: Error) =>
				Effect.sync(() => {
					onProgress?.({
						type: "workflow:stage:error",
						at: new Date().toISOString(),
						stage,
						durationMs: Date.now() - stageStartedAt,
						error: error.message,
					});
				})
			),
		);
	}

	private recordHistoryAndAnalytics(searchResponse: {
		query: string;
		totalResults: number;
		enginesUsed: string[];
		searchTime: number;
		cached: boolean;
	}): Effect.Effect<void, Error> {
		return Effect.gen(this, function*() {
			const historyEntry: SearchHistoryEntry = {
				id: randomUUID(),
				query: searchResponse.query,
				timestamp: new Date().toISOString(),
				resultsCount: searchResponse.totalResults,
				enginesUsed: searchResponse.enginesUsed,
				searchTime: searchResponse.searchTime,
				cached: searchResponse.cached,
			};

			yield* this.historyService.addEntry(historyEntry);

			for (const engine of searchResponse.enginesUsed) {
				const metric: SearchMetric = {
					query: searchResponse.query,
					timestamp: new Date().toISOString(),
					engine,
					resultsCount: searchResponse.totalResults,
					searchTime: searchResponse.searchTime,
					cached: searchResponse.cached,
					success: true,
				};
				yield* this.analyticsService.recordMetric(metric);
			}
		});
	}
}

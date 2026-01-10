import { Effect } from "effect";
import {
	ContentExtractorService,
	ContentFormatterService,
	ImageSearchService,
	NewsSearchService,
	CategorySearchService,
	ProxyRotationService,
	AntiDetectionService,
	MCPServer,
	SearchHistoryService,
	AnalyticsService,
} from "../services";
import { SearchQuery } from "../types";

export class ServiceFacade {
	constructor(
		private contentExtractor: ContentExtractorService,
		private contentFormatter: ContentFormatterService,
		private imageSearchService: ImageSearchService,
		private newsSearchService: NewsSearchService,
		private categorySearchService: CategorySearchService,
		private proxyRotationService: ProxyRotationService | null,
		private antiDetectionService: AntiDetectionService,
		private mcpServer: MCPServer,
		private historyService: SearchHistoryService,
		private analyticsService: AnalyticsService,
	) {}

	extractContent(url: string) {
		return this.contentExtractor.extract(url);
	}

	extractContentBatch(urls: string[]) {
		return this.contentExtractor.extractBatch(urls);
	}

	searchImages(
		query: SearchQuery,
		options?: { size?: "small" | "medium" | "large" | "hd"; minWidth?: number; minHeight?: number },
	) {
		return this.imageSearchService.searchImages(query, options);
	}

	searchNews(query: SearchQuery) {
		return this.newsSearchService.searchNews(query);
	}

	searchByCategory(query: SearchQuery, category: "github" | "research" | "mixed" | "general") {
		return this.categorySearchService.searchByCategory(query, category);
	}

	formatContent(result: any, formats: ("text" | "markdown" | "links" | "structured")[]) {
		return this.contentFormatter.formatContent(result, formats);
	}

	formatBatch(results: any[], formats: ("text" | "markdown" | "links" | "structured")[]) {
		return this.contentFormatter.formatBatch(results, formats);
	}

	getNextProxy() {
		if (!this.proxyRotationService) {
			return Effect.succeed(null);
		}
		return this.proxyRotationService.getNextProxy();
	}

	markProxyFailure(proxyUrl: string) {
		if (!this.proxyRotationService) {
			return Effect.succeed(undefined);
		}
		return this.proxyRotationService.markFailure(proxyUrl);
	}

	markProxySuccess(proxyUrl: string) {
		if (!this.proxyRotationService) {
			return Effect.succeed(undefined);
		}
		return this.proxyRotationService.markSuccess(proxyUrl);
	}

	getProxyStats() {
		if (!this.proxyRotationService) {
			return Effect.succeed({ total: 0, available: 0, failed: 0, inCooldown: 0 });
		}
		return this.proxyRotationService.getStats();
	}

	getRandomHeaders() {
		return this.antiDetectionService.getRandomHeaders();
	}

	getRandomUserAgent() {
		return this.antiDetectionService.getRandomUserAgent();
	}

	getRandomDelay(min?: number, max?: number) {
		return this.antiDetectionService.getRandomDelay(min, max);
	}

	simulateHumanBehavior() {
		return this.antiDetectionService.simulateHumanBehavior();
	}

	getMCPTools() {
		return Effect.sync(() => this.mcpServer.getTools());
	}

	async callMCPTool(name: string, args: unknown) {
		return this.mcpServer.callTool(name, args);
	}

	getHistory(limit?: number) {
		return this.historyService.getHistory(limit);
	}

	getRecentQueries(limit?: number) {
		return this.historyService.getRecentQueries(limit);
	}

	getHistoryStats() {
		return this.historyService.getStats();
	}

	clearHistory() {
		return this.historyService.clearHistory();
	}

	getAnalytics() {
		return this.analyticsService.getAnalytics();
	}

	getAnalyticsStats() {
		return this.analyticsService.getStats();
	}

	getTopQueries(limit?: number) {
		return this.analyticsService.getTopQueries(limit);
	}

	getEngineUsage() {
		return this.analyticsService.getEngineUsage();
	}

	resetAnalytics() {
		return this.analyticsService.reset();
	}
}

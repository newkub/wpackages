import type { Accessor } from "../types/ref.type";

export interface SignalAnalyticsReport {
	readonly topSignals: Array<{
		signal: Accessor<unknown>;
		reads: number;
		updates: number;
	}>;
	readonly updateFrequency: Record<string, number>;
	readonly memoryUsage: {
		total: number;
		bySignal: Record<string, number>;
	};
	readonly performanceMetrics: {
		avgReadTime: number;
		avgUpdateTime: number;
		totalEffects: number;
	};
}

const signalMetrics = new WeakMap<Accessor<unknown>, {
	reads: number;
	updates: number;
	readTimes: number[];
	updateTimes: number[];
}>();

let analyticsEnabled = false;

export const enableSignalAnalytics = (): void => {
	analyticsEnabled = true;
};

export const disableSignalAnalytics = (): void => {
	analyticsEnabled = false;
};

export const trackSignalRead = <T>(signal: Accessor<T>, readTime: number): void => {
	if (!analyticsEnabled) return;

	let metrics = signalMetrics.get(signal);
	if (!metrics) {
		metrics = {
			reads: 0,
			updates: 0,
			readTimes: [],
			updateTimes: [],
		};
		signalMetrics.set(signal, metrics);
	}

	metrics.reads++;
	metrics.readTimes.push(readTime);

	if (metrics.readTimes.length > 1000) {
		metrics.readTimes.shift();
	}
};

export const trackSignalUpdate = <T>(signal: Accessor<T>, updateTime: number): void => {
	if (!analyticsEnabled) return;

	let metrics = signalMetrics.get(signal);
	if (!metrics) {
		metrics = {
			reads: 0,
			updates: 0,
			readTimes: [],
			updateTimes: [],
		};
		signalMetrics.set(signal, metrics);
	}

	metrics.updates++;
	metrics.updateTimes.push(updateTime);

	if (metrics.updateTimes.length > 1000) {
		metrics.updateTimes.shift();
	}
};

export const getSignalAnalyticsReport = (): SignalAnalyticsReport => {
	const signals: Array<{
		signal: Accessor<unknown>;
		reads: number;
		updates: number;
	}> = [];

	const updateFrequency: Record<string, number> = {};
	let totalReadTime = 0;
	let totalUpdateTime = 0;
	let totalReads = 0;
	let totalUpdates = 0;

	for (const [signal, metrics] of signalMetrics.entries()) {
		signals.push({
			signal,
			reads: metrics.reads,
			updates: metrics.updates,
		});

		const signalId = signal.toString();
		updateFrequency[signalId] = metrics.updates / (metrics.reads || 1);

		totalReadTime += metrics.readTimes.reduce((a, b) => a + b, 0);
		totalUpdateTime += metrics.updateTimes.reduce((a, b) => a + b, 0);
		totalReads += metrics.reads;
		totalUpdates += metrics.updates;
	}

	const topSignals = signals
		.sort((a, b) => b.reads + b.updates - (a.reads + a.updates))
		.slice(0, 10);

	return {
		topSignals,
		updateFrequency,
		memoryUsage: {
			total: signals.length * 100,
			bySignal: Object.fromEntries(
				signals.map((s) => [s.signal.toString(), 100]),
			),
		},
		performanceMetrics: {
			avgReadTime: totalReads > 0 ? totalReadTime / totalReads : 0,
			avgUpdateTime: totalUpdates > 0 ? totalUpdateTime / totalUpdates : 0,
			totalEffects: totalUpdates,
		},
	};
};

export const resetSignalAnalytics = (): void => {
	signalMetrics.clear();
};

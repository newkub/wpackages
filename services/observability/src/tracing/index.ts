/**
 * @wpackages/tracing
 *
 * A lightweight, zero-dependency, and high-performance tracing library inspired by OpenTelemetry,
 * tailored for the wpackages monorepo.
 */

// High-level API for easy initialization
export { init } from "./config/tracing.config";
export type { TracingConfig } from "./config/tracing.config";

// Core API (for advanced manual setup)
export { TracerProvider } from "./services/provider.service";

// Processors
export { SimpleSpanProcessor } from "./services/processor.service";
export { BatchSpanProcessor } from "./services/processor.service";

// Exporters
export { ConsoleSpanExporter } from "./services/exporter.service";
export { InMemorySpanExporter } from "./services/exporter.service";
export { WebUiExporter } from "./services/exporter.service";
export { OTLPSpanExporter, createOTLPSpanExporter } from "./exporters";

// Context
export { getActiveSpan, withActiveSpan } from "./services/context.service";

// No-op implementation for disabling tracing
export { NOOP_TRACER } from "./services/tracer.service";

// Propagation
export { CompositePropagator, W3cBaggagePropagator, W3cTraceContextPropagator } from "./services/propagation.service";

// Baggage
export { createBaggage } from "./models/baggage";
export type { Baggage, BaggageEntry } from "./models/baggage";

// Context
export { getActiveBaggage, getActiveContext, withActiveBaggage, withActiveContext } from "./services/context.service";

// Instrumentations
export { FetchInstrumentation } from "./services/instrumentation.service";
export { ExpressInstrumentation, HttpInstrumentation } from "./services/instrumentation.service";

// Samplers
export { ParentBasedSampler, TraceIdRatioBasedSampler } from "./services/sampler.service";

// Utils
export { getTraceContext } from "./utils/log.util";
export { registerGracefulShutdown } from "./utils/shutdown.util";
export {
	generateCorrelationId,
	setCorrelationId,
	getCorrelationId,
	clearCorrelationId,
	withCorrelationId,
	getCorrelationIdHeader,
	extractCorrelationIdFromHeaders,
	injectCorrelationIdToHeaders,
} from "./utils/correlation-id";

// Metrics
export {
	ConsoleMetricExporter,
	InMemoryMetricReader,
	MeterProviderImpl as MeterProvider,
} from "./services/metrics.service";
export type { Counter, Meter, MetricExporter, MetricReader } from "./types/metrics";
export { HealthMetricsCollector, createHealthMetricsCollector } from "./metrics/health-metrics";
export type { HealthMetrics } from "./metrics/health-metrics";
export { AttributeEnricher, createAttributeEnricher } from "./enrichment/enricher";
export type { EnrichmentConfig } from "./enrichment/enricher";
export { NestedContextManager, createNestedContextManager } from "./context/nested-context";
export type { ContextLevel } from "./context/nested-context";
export { AsyncBatchProcessor, createAsyncBatchProcessor } from "./processors/async-batch-processor";
export type { AsyncBatchProcessorConfig } from "./processors/async-batch-processor";
export { Histogram, createHistogram } from "./metrics/aggregation/histogram";
export type { HistogramConfig, HistogramData } from "./metrics/aggregation/histogram";
export { RateCalculator, createRateCalculator } from "./metrics/aggregation/rate";
export type { RateData } from "./metrics/aggregation/rate";

// All public types
export type * from "./types/tracing";

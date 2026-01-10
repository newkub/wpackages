# Analytics Service

Analytics service สำหรับ tracking events และส่งข้อมูล analytics ไปยัง endpoint ที่กำหนด ด้วย Effect-TS และ functional programming

## Features

### Core Features
- ✅ Event tracking ด้วย Effect-TS
- ✅ Batch sending สำหรับประสิทธิภาพที่ดีขึ้น
- ✅ Auto flush ตาม interval ที่กำหนด
- ✅ Event validation
- ✅ Error handling ที่ชัดเจน

### Advanced Features
- ✅ **Retry Logic with Exponential Backoff** - Retry อัตโนมัติเมื่อ network fail
- ✅ **Request Timeout Handling** - ตั้งเวลา timeout สำหรับ requests
- ✅ **Offline Queue** - เก็บ events ไว้เมื่อ offline แล้ว sync เมื่อกลับมา online
- ✅ **Event Compression** - Compress payloads ด้วย gzip เพื่อลด bandwidth
- ✅ **Event Sampling** - Sample events สำหรับ high-traffic scenarios
- ✅ **Event Middleware System** - Transform/enrich/filter events ก่อนส่ง
- ✅ **Event Context Enrichment** - Auto-add device, page, performance info
- ✅ **Event Filtering** - Block/allow events ตาม rules
- ✅ **Network Awareness** - Detect network status และปรับ batch size
- ✅ **Priority Queue** - High priority events จะถูกส่งก่อน
- ✅ **Debug Mode** - Logging รายละเอียดสำหรับ development

## Installation

```bash
bun install @wpackages/analytics
```

## Usage

### Basic Usage

```typescript
import { AnalyticsClient } from '@wpackages/analytics';

const client = new AnalyticsClient({
  apiKey: 'your-api-key',
  endpoint: 'https://your-analytics-api.com/v1/events',
  batchSize: 10,
  flushInterval: 30000,
});

// Track single event
await Effect.runPromise(
  client.track({
    name: 'page_view',
    properties: { path: '/home' },
  })
);

// Track batch events
await Effect.runPromise(
  client.trackBatch([
    { name: 'click', properties: { button: 'submit' } },
    { name: 'click', properties: { button: 'cancel' } },
  ])
);

// Identify user
await Effect.runPromise(
  client.identify('user-123', { email: 'user@example.com' })
);

// Manual flush
await Effect.runPromise(client.flush());
```

### Advanced Configuration

```typescript
const client = new AnalyticsClient({
  apiKey: 'your-api-key',
  endpoint: 'https://your-analytics-api.com/v1/events',
  batchSize: 10,
  flushInterval: 30000,
  enableDebug: true,
  
  // Retry & Timeout
  requestTimeout: 5000,
  retryAttempts: 3,
  retryDelay: 1000,
  
  // Queue Management
  maxQueueSize: 100,
  
  // Compression
  enableCompression: true,
  compressionThreshold: 1024,
  
  // Sampling
  enableSampling: true,
  samplingRate: 0.5,
  importantEvents: ['error', 'purchase'],
  
  // Offline Support
  enableOffline: true,
  offlineStorageKey: 'analytics-offline-queue',
  maxOfflineStorage: 1024 * 1024,
  
  // Features
  enableMiddleware: true,
  enableContextEnrichment: true,
  enableFiltering: true,
  enableNetworkAwareness: true,
  
  // Filtering
  blockedEvents: ['debug_event'],
  allowedEvents: ['page_view', 'click', 'submit'],
});
```

### Middleware

```typescript
client.addMiddleware({
  name: 'enrich-user-data',
  process: (event) => ({
    ...event,
    properties: {
      ...event.properties,
      userId: getCurrentUserId(),
    },
  }),
});
```

### Context Providers

```typescript
client.addContextProvider({
  name: 'app-version',
  getContext: () => ({
    appVersion: '1.0.0',
    buildNumber: '123',
  }),
});
```

### Event Filters

```typescript
client.addFilter({
  name: 'block-debug',
  shouldBlock: (event) => event.name.startsWith('debug_'),
});
```

### Network Awareness

```typescript
if (client.isOnline()) {
  console.log('Online - sending events');
} else {
  console.log('Offline - events queued');
}

const status = client.getNetworkStatus();
console.log(status);
```

## Development

```bash
bun install          # Install dependencies
bun run dev          # Run the example
bun run test         # Run tests
bun run test:watch   # Run tests in watch mode
bun run test:coverage # Run tests with coverage
bun run lint         # Type check
bun run format       # Format code
bun run verify       # Run all checks
bun run build        # Build the package
```

## Comparison with External Services

| Feature | @wpackages/analytics | Segment | Mixpanel | GA4 | PostHog |
|---------|---------------------|---------|----------|-----|---------|
| Type Safety | ✅ Effect-TS | ✅ TypeScript | ✅ TypeScript | ⚠️ JavaScript | ✅ TypeScript |
| Runtime Validation | ✅ Custom | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |
| Retry Logic | ✅ Exponential Backoff | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Offline Support | ✅ localStorage | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |
| Compression | ✅ Gzip | ✅ Yes | ❌ No | ❌ No | ❌ No |
| Sampling | ✅ Configurable | ❌ No | ❌ No | ✅ Yes | ❌ No |
| Middleware | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |
| Context Enrichment | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Filtering | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |
| Network Awareness | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No |
| Priority Queue | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No |
| Open Source | ✅ Yes | ❌ No | ❌ No | ❌ No | ✅ Yes |
| Bundle Size | ~8KB | ~15KB | ~20KB | ~10KB | ~25KB |

## Unique Selling Points

- **Effect-TS Integration**: Type-safe async operations with functional programming
- **Privacy-First**: No auto-tracking, full control over what's sent
- **Lightweight**: Smallest bundle size among competitors
- **Offline-First**: Works without internet, syncs when back online
- **Extensible**: Middleware system for customization
- **Network Aware**: Adapts to network conditions
- **Priority Queue**: Important events sent first
- **Open Source**: Self-hosted, no vendor lock-in

## License

MIT

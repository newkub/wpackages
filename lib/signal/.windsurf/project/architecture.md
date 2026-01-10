# Architecture

## Directory Structure

```
src/
├── apis/              # Public APIs
│   ├── signal.ts      # createSignal
│   └── memo.ts        # createMemo
├── services/          # Core services
│   ├── reactive.service.ts    # track, trigger, reactive
│   ├── effect.scope.ts        # createEffect, createEffectScope
│   ├── batch.service.ts       # batch, queueEffect
│   ├── resource.service.ts    # createResource
│   ├── selector.service.ts    # createSelector
│   └── watch.service.ts       # watch, watchMultiple, on
├── types/             # Type definitions
│   ├── ref.type.ts
│   ├── reactive.type.ts
│   ├── effect.type.ts
│   ├── memo.type.ts
│   ├── resource.type.ts
│   ├── watch.type.ts
│   ├── batch.type.ts
│   └── computed.type.ts
├── components/        # Component abstractions
│   ├── signal.component.ts
│   ├── memo.component.ts
│   └── effect.component.ts
├── config/            # Configuration
│   └── defaults.ts
├── constant/          # Constants
│   └── messages.const.ts
├── utils/             # Utilities
│   ├── signal.util.ts
│   ├── helpers.ts
│   └── validator.ts
└── index.ts           # Main export
```

## Core Concepts

### 1. Signal

Core reactive primitive ที่ใช้ WeakMap เพื่อ track dependencies:

```typescript
const signal = { value: initialValue };
const getter = () => { track(signal, "value"); return signal.value; };
const setter = (newValue) => { signal.value = newValue; trigger(signal, "value"); };
```

### 2. Reactive Graph

ใช้ `targetMap: WeakMap<object, Map<any, Set<Effect>>>` เพื่อ:

- Track dependencies ระหว่าง signals และ effects
- WeakMap ช่วย prevent memory leaks
- Map และ Set สำหรับ efficient lookups

### 3. Effect

Function ที่ auto-runs เมื่อ dependencies เปลี่ยน:

```typescript
interface Effect {
  (): void;
  cleanup?: EffectCleanup;
  deps?: Set<Set<Effect>>;
  dispose?: () => void;
}
```

### 4. Effect Stack

Stack ของ effects ที่กำลัง execute:

```typescript
const effectStack: Effect[] = [];
export let currentEffect: Effect | null = null;
```

ใช้สำหรับ:
- Track dependencies ของ effect ปัจจุบัน
- Support nested effects
- Proper cleanup

### 5. Batching

Queue effects และ execute ใน single batch:

```typescript
let isBatching = false;
const queue = new Set<Effect>();

export function batch(fn: () => void): void {
  const wasBatching = isBatching;
  isBatching = true;
  try {
    fn();
  } finally {
    if (!wasBatching) {
      isBatching = false;
      queue.forEach(effect => effect());
      queue.clear();
    }
  }
}
```

### 6. Proxy-based Reactivity

ใช้ Proxy สำหรับ `reactive()` API:

```typescript
export function reactive<T extends object>(target: T): Reactive<T> {
  return new Proxy(target, {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      track(target, key);
      if (result !== null && typeof result === "object") {
        return reactive(result);
      }
      return result;
    },
    set(target, key, value, receiver) {
      const oldValue = Reflect.get(target, key, receiver);
      const result = Reflect.set(target, key, value, receiver);
      if (oldValue !== value) {
        trigger(target, key);
      }
      return result;
    },
  });
}
```

## Data Flow

```
Signal Value Change
       ↓
   trigger()
       ↓
   Get effects from targetMap
       ↓
   Queue effects (if batching)
       ↓
   Execute effects
       ↓
   Effects re-run and track new dependencies
```

## Memory Management

- **WeakMap** สำหรับ targetMap - auto cleanup เมื่อ objects ถูก GC
- **Set** สำหรับ dependencies - efficient add/delete
- **Effect cleanup** - dispose เมื่อ effect scope ถูก dispose
- **Effect deps tracking** - remove effect จาก dependencies เมื่อ dispose

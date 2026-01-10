# Features

## Core Primitives

### 1. createSignal(initialValue, options?)

สร้าง reactive signal ที่ return `[getter, setter]`:

```typescript
const [count, setCount] = createSignal(0);
const [name, setName] = createSignal("John", {
  equals: (prev, next) => prev === next
});
```

**Features:**
- Fine-grained reactivity
- Custom equality check
- Type-safe

### 2. createMemo(fn, options?)

สร้าง derived signal ที่ auto-recompute:

```typescript
const doubled = createMemo(() => count() * 2);
```

**Features:**
- Lazy evaluation
- Automatic dependency tracking
- Caching
- Custom equality check

### 3. createEffect(fn)

สร้าง effect ที่ auto-runs เมื่อ dependencies เปลี่ยน:

```typescript
createEffect(() => {
  console.log(count());
});
```

**Features:**
- Automatic dependency tracking
- Cleanup support
- Nested effects

### 4. reactive(object)

สร้าง proxy-based reactive object:

```typescript
const state = reactive({ count: 0 });
state.count = 1; // Triggers updates
```

**Features:**
- Deep reactivity
- Natural object syntax
- Automatic tracking

## Advanced Features

### 5. createResource(source, initialValue?)

จัดการ async data fetching:

```typescript
const [user, { loading, error, refetch }] = createResource(() => fetchUser(1));
```

**Features:**
- Loading state
- Error handling
- Refetch capability
- Reactive to source changes

### 6. createSelector(source)

สร้าง efficient selector สำหรับ lists:

```typescript
const [selected, setSelected] = createSignal(1);
const isSelected = createSelector(selected);
```

**Features:**
- Efficient key checking
- Memoized per key
- Useful for large lists

### 7. createEffectScope(detached?)

สร้าง scope สำหรับ grouping effects:

```typescript
const scope = createEffectScope();
scope.run(() => {
  createEffect(() => console.log(count()));
});
scope.dispose(); // Cleanup all effects
```

**Features:**
- Group effects together
- Batch cleanup
- Detached scopes

### 8. onCleanup(fn)

ลงทะเบียน cleanup function ใน effect:

```typescript
createEffect(() => {
  const interval = setInterval(() => {}, 1000);
  onCleanup(() => clearInterval(interval));
});
```

**Features:**
- Auto cleanup on effect re-run
- Auto cleanup on scope dispose

### 9. batch(fn)

Group updates เป็น single reaction:

```typescript
batch(() => {
  setCount(1);
  setName("Jane");
}); // Effects run once
```

**Features:**
- Reduce redundant updates
- Improve performance
- Consistent state

### 10. watch(source, callback, options?)

Watch changes และ run callback:

```typescript
watch(count, (value, prev) => {
  console.log(`Changed from ${prev} to ${value}`);
}, { immediate: true });
```

**Features:**
- Track changes
- Immediate option
- Previous value access

### 11. watchMultiple(sources, callback, options?)

Watch multiple sources:

```typescript
watchMultiple([count, name], ([count, name], [prevCount, prevName]) => {
  console.log(count, name);
});
```

**Features:**
- Multiple sources
- Array of values
- Previous values

### 12. on(deps, fn)

Explicit dependency control:

```typescript
const effectFn = on(count, (value, prev) => {
  console.log(`Count changed to ${value}`);
});
createEffect(effectFn);
```

**Features:**
- Explicit dependencies
- Deferred computation
- Untracked execution

## Type System

### 13. Accessor<T>

Type สำหรับ getter function:

```typescript
type Accessor<T> = () => T;
```

### 14. Setter<T>

Type สำหรับ setter function:

```typescript
type Setter<T> = (v: T) => T;
```

### 15. Signal<T>

Type สำหรับ signal tuple:

```typescript
type Signal<T> = [Accessor<T>, Setter<T>];
```

### 16. Reactive<T>

Type สำหรับ reactive objects:

```typescript
type Reactive<T extends object> = T;
```

### 17. Effect

Type สำหรับ effect functions:

```typescript
interface Effect {
  (): void;
  cleanup?: EffectCleanup;
  deps?: Set<Set<Effect>>;
  dispose?: () => void;
}
```

### 18. EffectScope

Type สำหรับ effect scopes:

```typescript
interface EffectScope {
  effects: Set<Effect>;
  dispose: () => void;
}
```

### 19. Resource<T>

Type สำหรับ async resources:

```typescript
type Resource<T> = [Ref<T | undefined>, ResourceActions<T>];
```

### 20. ResourceActions<T>

Type สำหรับ resource actions:

```typescript
type ResourceActions<T> = {
  loading: Computed<boolean>;
  error: Ref<unknown>;
  refetch: () => Promise<T | undefined>;
};
```

## Configuration

### 21. SignalOptions<T>

Options สำหรับ createSignal:

```typescript
interface SignalOptions<T> {
  equals?: false | ((prev: T, next: T) => boolean);
}
```

### 22. MemoOptions<T>

Options สำหรับ createMemo:

```typescript
interface MemoOptions<T> {
  equals?: false | ((prev: T, next: T) => boolean);
}
```

### 23. WatchOptions

Options สำหรับ watch:

```typescript
type WatchOptions = {
  immediate?: boolean;
};
```

### 24. BatchOptions

Options สำหรับ batch:

```typescript
type BatchOptions = {
  defer?: boolean;
};
```

## Internal Features

### 25. track(target, key)

Track dependencies ของ effect ปัจจุบัน

### 26. trigger(target, key)

Trigger effects ที่ dependent บน target/key

### 27. queueEffect(effect)

Queue effect สำหรับ batch execution

### 28. currentEffect

Global reference ถึง effect ปัจจุบัน

### 29. setCurrentEffect(effect)

Set current effect สำหรับ tracking

### 30. untrack(fn)

Execute function โดยไม่ track dependencies

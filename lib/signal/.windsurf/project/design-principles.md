# Design Principles

## 1. Separation of Concerns

แยก code ออกเป็น layers ที่ชัดเจน:

- **apis/** - Public APIs ที่ user ใช้งานโดยตรง (createSignal, createMemo)
- **services/** - Core logic และ internal services (reactive.service, effect.scope)
- **types/** - TypeScript type definitions
- **components/** - Component-level abstractions (ถ้ามี)
- **config/** - Configuration และ defaults
- **utils/** - Helper functions

## 2. Fine-Grained Reactivity

ใช้ WeakMap-based tracking system เพื่อ:

- Track dependencies ที่ level ของ property
- Update เฉพาะส่วนที่เปลี่ยนแปลงเท่านั้น
- Avoid memory leaks ด้วย WeakMap
- Surgical updates ไม่มี VDOM overhead

## 3. [getter, setter] API Pattern

แยก read และ write operations:

```typescript
const [count, setCount] = createSignal(0);
```

เพื่อให้:

- Compiler สามารถ optimize ได้ง่ายขึ้น
- Explicit control ว่าอะไรเป็น read อะไรเป็น write
- Type-safe กว่า

## 4. Effect Stack & Scoping

ใช้ effect stack เพื่อ:

- Track dependencies ของ effect ปัจจุบัน
- Support nested effects
- Enable effect scopes สำหรับ cleanup

## 5. Batch Updates

Queue effects และ execute ใน batch:

- Reduce redundant updates
- Improve performance
- Consistent state updates

## 6. Type Safety

Full TypeScript support:

- Strong typing สำหรับทุก API
- Generic types สำหรับ flexibility
- Type inference ที่ดี

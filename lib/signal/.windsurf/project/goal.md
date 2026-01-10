# Project Goal

@wpackages/signal เป็น high-performance, compiler-friendly reactivity library ที่สร้างขึ้นเพื่อ:

1. **ให้ reactive primitives ที่ simple และ lightweight** สำหรับ functional programming
2. **Fine-grained reactivity** ที่ไม่ต้องพึ่งพา Virtual DOM
3. **Framework-agnostic** สามารถใช้กับทุก framework ได้
4. **Compiler-friendly** เตรียมพร้อมสำหรับ compile-time optimizations ในอนาคต
5. **Type-safe** ด้วย TypeScript เต็มรูปแบบ

## หลักการออกแบบ

- Minimal dependencies และ bundle size เล็ก
- Clean architecture แยก concerns ชัดเจน
- Performance-first ด้วย fine-grained updates
- Easy to understand และ use

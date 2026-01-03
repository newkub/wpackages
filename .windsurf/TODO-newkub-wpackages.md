# TODO (newkub/wpackages)

- [ ] วิเคราะห์โปรเจกต์และ global workflows ที่เกี่ยวข้อง
- [ ] Refactor: packages/history
- [ ] Comparison + make real: lib/wshell
- [ ] Comparison + make real: utils/functional
- [ ] Update README: lib/wshell + root
- [ ] Check file length (tokei) และ refactor ถ้าจำเป็น
- [ ] Run lint (turbo)
- [ ] Run build (turbo)
- [ ] Run test (turbo)
- [ ] Split commit ตาม workflow

## utils/functional (Comparison + Make Real)

- [ ] /comparison: เทียบกับคู่แข่ง + สรุป gap
- [ ] /make-real: เอา mock ออก, เพิ่ม type-safety, เติม test ที่ว่าง, ล้างไฟล์ว่าง

## packages/webserver (Comparison + Make Real)

- [ ] Install `@effect/platform-bun`
- [ ] Refactor `src/app.ts` to use `@effect/platform`
- [ ] Refactor `src/index.ts` to use `BunRuntime`
- [ ] Remove old `WServer` and middleware
- [ ] Run verification script

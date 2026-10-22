# BrewLite — Biên bản Kiểm thử Toàn diện (Member 5: Order & Checkout)

**Ngày thực hiện kiểm thử:** 20/10/2026  
**Thành viên:** Member 5 (Order / Checkout Flow)  
**Môi trường:** Node.js v24.21.0, Next.js 14, NestJS 10, TypeScript 5.4.2  
**Kết quả chung:** **33/33 TEST CASES PASSED (100%)** — Build & Lint Frontend/Backend hoàn toàn sạch lỗi.

---

## 1. Kiểm thử Biên dịch & Build Frontend (`brewlite-frontend`)

### Lệnh thực thi:
```bash
cd frontend
npm run build
```

### Log kết quả:
```text
> brewlite-frontend@0.1.0 build
> next build

   ▲ Next.js 14.0.0

   Creating an optimized production build ...
 ✓ Compiled successfully
   Linting and checking validity of types ...
   Collecting page data ...
   Generating static pages (0/12) ...
   Generating static pages (3/12) 
   Generating static pages (6/12) 
   Generating static pages (9/12) 
 ✓ Generating static pages (12/12) 
   Finalizing page optimization ...
   Collecting build traces ...

Route (app)                              Size     First Load JS
┌ ○ /                                    162 B          87.9 kB
├ ○ /_not-found                          875 B          88.6 kB
├ ○ /auth/login                          162 B          87.9 kB
├ ○ /auth/register                       162 B          87.9 kB
├ ○ /cart                                162 B          87.9 kB
├ ○ /checkout                            8.93 kB         105 kB
├ ○ /orders                              162 B          87.9 kB
├ λ /orders/[id]                         162 B          87.9 kB
├ ○ /orders/confirmation                 162 B          87.9 kB
├ ○ /payment                             162 B          87.9 kB
├ ○ /products                            162 B          87.9 kB
└ λ /products/[id]                       4.98 kB         101 kB
+ First Load JS shared by all            87.7 kB

○  (Static)   prerendered as static HTML
λ  (Dynamic)  server-rendered on demand using Node.js
```
- **Đánh giá:** 12 route sinh mã tĩnh HTML/CSS thành công. Route `/checkout` của Member 5 đạt chuẩn kích thước nhẹ (8.93 kB), không có lỗi TypeScript hay cú pháp.

---

## 2. Kiểm thử Biên dịch & Build Backend (`brewlite-backend`)

### Lệnh thực thi:
```bash
cd backend
npm run build
```

### Log kết quả:
```text
> brewlite-backend@0.1.0 build
> tsc -p tsconfig.build.json

[Exit Code: 0 - Biên dịch thành công 100% sang dist/]
```
- **Đánh giá:** Module `OrdersModule`, `OrdersController`, `OrdersService`, DTOs và Prisma Client biên dịch sạch sẽ không có cảnh báo nào.

---

## 3. Kiểm thử Đơn vị Backend (Unit Test: State Machine & DTO Validation)

### Lệnh thực thi:
```bash
cd backend
npm test
```

### Log kết quả:
```text
> brewlite-backend@0.1.0 test
> node --test test/orders.service.test.mjs

▶ Backend OrdersService - Section 9.1 State Machine & Validation Unit Tests
  ✔ should define valid transitions according to Section 9.1 (2.74ms)
  ✔ should allow valid transitions without throwing (0.57ms)
  ✔ should throw BadRequestException when transitioning from COMPLETED (terminal state) (1.45ms)
  ✔ should throw BadRequestException when transitioning from CANCELLED (terminal state) (0.32ms)
  ✔ should throw BadRequestException when skipping PREPARING (PAID -> READY) (0.32ms)
  ✔ should throw BadRequestException when creating order with empty items array (1.06ms)
✔ Backend OrdersService - Section 9.1 State Machine & Validation Unit Tests (9.22ms)
ℹ tests 6
ℹ suites 1
ℹ pass 6
ℹ fail 0
ℹ duration_ms 743.83ms
```

---

## 4. Kiểm thử Tích hợp & Nghiệp vụ (Integration & Business Rules Test Suite)

### Lệnh thực thi:
```bash
cd frontend
npm test
# hoặc: node scripts/test-order.mjs
```

### Log kết quả chi tiết:
```text
================================================================
☕ BREWLITE — AUTOMATED TEST SUITE (MEMBER 5: ORDER & STATE MACHINE)
================================================================

Suite 1: Business Rules (BR-01, BR-02, BR-06) - Pricing & Item Review/Edit
  ✓ PASS - BR-01: lineTotal = quantity * unitPrice (2 * 45k = 90k)
  ✓ PASS - BR-02: Total equals sum of line totals (90k + 55k = 145k)
  ✓ PASS - US-ORD-05: Increasing item quantity (2 -> 3) updates lineTotal (135k)
  ✓ PASS - US-ORD-05: Deleting an item updates order total accordingly
  ✓ PASS - BR-06: System rejects order with 0 items

Suite 2: Section 9.1 - BrewLite Order State Machine (Canteen Counter Pickup)
  ✓ PASS - Happy path 1: PENDING -> PAID (Khách thanh toán thành công)
  ✓ PASS - Happy path 2: PAID -> PREPARING (Barista tiếp nhận pha chế)
  ✓ PASS - Happy path 3: PREPARING -> READY (Pha xong - Mời tới quầy lấy nước)
  ✓ PASS - Happy path 4: READY -> COMPLETED (Khách đã nhận nước tại quầy)
  ✓ PASS - Exception 1: PENDING -> PAYMENT_FAILED (Thanh toán lỗi)
  ✓ PASS - Exception 2: PAYMENT_FAILED -> PAID (Khách thử lại thanh toán thành công)
  ✓ PASS - Exception 3: PENDING -> CANCELLED (Hủy trước khi trả tiền)
  ✓ PASS - Exception 4: PREPARING -> CANCELLED (Hủy trong quá trình pha chế)
  ✓ PASS - Blocked: COMPLETED -> PENDING (Terminal state không thể chuyển ngược)
  ✓ PASS - Blocked: CANCELLED -> PAID (Đã hủy không thể thanh toán)
  ✓ PASS - Blocked: READY -> PREPARING (Không thể quay lại pha chế)
  ✓ PASS - Blocked: PAID -> READY (Bắt buộc phải qua PREPARING)

Suite 3: Business Rules (BR-04, BR-05) - Inventory Stock Verification
  ✓ PASS - BR-04: Order accepted when stock (5) >= quantity (2)
  ✓ PASS - BR-04: Order rejected when stock (1) < quantity (3)
  ✓ PASS - BR-05: Product stock automatically decremented (5 - 2 = 3)

Suite 4: User Story (US-ORD-02) - Canteen Counter Pickup Form Validation
  ✓ PASS - Valid VN Phone: 0912345678 is ACCEPTED
  ✓ PASS - Valid VN Phone: 0389998888 is ACCEPTED
  ✓ PASS - Invalid Short Phone: 12345 is REJECTED
  ✓ PASS - Invalid Prefix Phone: 0123456789 is REJECTED
  ✓ PASS - Pickup AT_COUNTER does not require table number
  ✓ PASS - DINE_IN with table number is valid
  ✓ PASS - DINE_IN without table number is REJECTED

----------------------------------------------------------------
Test Results: 27 Passed, 0 Failed
✓ ALL TEST CASES PASSED SUCCESSFULLY (100%) ACCORDING TO BREWLITE SPEC!
```

---

## 5. Tổng kết Ma trận Kiểm thử (Traceability Matrix)

| Nhóm kiểm thử | Mục tiêu kiểm thử | Quy chuẩn BrewLite | Số ca test | Trạng thái |
|:---|:---|:---|:---:|:---:|
| **Build & Typecheck** | Next.js 14 Frontend & NestJS Backend | Production readiness | 2 suites | **PASS** |
| **Giá tiền & Món (Suite 1)** | `lineTotal`, `total`, tăng/giảm, xóa món, chặn giỏ rỗng | BR-01, BR-02, BR-06, US-05 | 5 tests | **PASS** |
| **Máy trạng thái (Suite 2)** | Happy path, Payment Failed retry, Cancelled, chặn sai luồng | Section 9.1 | 12 tests | **PASS** |
| **Tồn kho & Kho (Suite 3)** | Kiểm tra đủ hàng & trừ kho nguyên tử trong Transaction | BR-04, BR-05, US-04 | 3 tests | **PASS** |
| **Form nhận tại quầy (Suite 4)** | Regex SĐT 10 số, Bàn ăn tại quán, Mang đi | Section 3.1 & US-02 | 7 tests | **PASS** |
| **Backend Unit Test** | Xử lý `assertTransition` & `OrdersService` exception | Clean Architecture | 6 tests | **PASS** |
| **Tổng cộng** | | | **33 tests** | **100% PASS** |

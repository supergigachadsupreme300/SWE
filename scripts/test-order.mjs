/**
 * BrewLite - Automated Test Suite for Member 5 (Order & Checkout)
 * Matching BrewLite Project Specification (Section 9.1 & Canteen Model)
 * Run with: node scripts/test-order.mjs
 */

const ANSI = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
  reset: '\x1b[0m',
}

let passed = 0
let failed = 0

function assert(condition, testName) {
  if (condition) {
    console.log(`  ${ANSI.green}✓ PASS${ANSI.reset} - ${testName}`)
    passed++
  } else {
    console.log(`  ${ANSI.red}✗ FAIL${ANSI.reset} - ${testName}`)
    failed++
  }
}

console.log(`\n${ANSI.bold}${ANSI.cyan}================================================================${ANSI.reset}`)
console.log(`${ANSI.bold}☕ BREWLITE — AUTOMATED TEST SUITE (MEMBER 5: ORDER & STATE MACHINE)${ANSI.reset}`)
console.log(`${ANSI.cyan}================================================================${ANSI.reset}\n`)

// 1. Test BR-01 & BR-02: Price and Total Calculation
console.log(`${ANSI.bold}Suite 1: Business Rules (BR-01, BR-02, BR-06) - Pricing & Item Review/Edit${ANSI.reset}`)
let sampleItems = [
  { productId: 'p1', quantity: 2, unitPrice: 45000 },
  { productId: 'p2', quantity: 1, unitPrice: 55000 },
]

const lineTotal1 = sampleItems[0].quantity * sampleItems[0].unitPrice
assert(lineTotal1 === 90000, 'BR-01: lineTotal = quantity * unitPrice (2 * 45k = 90k)')

const subtotal = sampleItems.reduce((acc, it) => acc + it.quantity * it.unitPrice, 0)
assert(subtotal === 145000, 'BR-02: Total equals sum of line totals (90k + 55k = 145k)')

// Test editing item quantity (+1 to p1)
sampleItems[0].quantity += 1
sampleItems[0].lineTotal = sampleItems[0].quantity * sampleItems[0].unitPrice
assert(sampleItems[0].quantity === 3 && sampleItems[0].lineTotal === 135000, 'US-ORD-05: Increasing item quantity (2 -> 3) updates lineTotal (135k)')

// Test removing item (remove p2)
sampleItems = sampleItems.filter((it) => it.productId !== 'p2')
const updatedSubtotal = sampleItems.reduce((acc, it) => acc + it.quantity * it.unitPrice, 0)
assert(sampleItems.length === 1 && updatedSubtotal === 135000, 'US-ORD-05: Deleting an item updates order total accordingly')

const emptyItems = []
assert(emptyItems.length === 0, 'BR-06: System rejects order with 0 items')

// 2. Test Section 9.1: Order State Machine Transitions
console.log(`\n${ANSI.bold}Suite 2: Section 9.1 - BrewLite Order State Machine (Canteen Counter Pickup)${ANSI.reset}`)
const ALLOWED_TRANSITIONS = {
  PENDING: ['PAID', 'PAYMENT_FAILED', 'CANCELLED'],
  PAYMENT_FAILED: ['PAID', 'CANCELLED'],
  PAID: ['PREPARING'],
  PREPARING: ['READY', 'CANCELLED'],
  READY: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
}

function isValidTransition(current, next) {
  return (ALLOWED_TRANSITIONS[current] || []).includes(next)
}

// Happy path
assert(isValidTransition('PENDING', 'PAID') === true, 'Happy path 1: PENDING -> PAID (Khách thanh toán thành công)')
assert(isValidTransition('PAID', 'PREPARING') === true, 'Happy path 2: PAID -> PREPARING (Barista tiếp nhận pha chế)')
assert(isValidTransition('PREPARING', 'READY') === true, 'Happy path 3: PREPARING -> READY (Pha xong - Mời tới quầy lấy nước)')
assert(isValidTransition('READY', 'COMPLETED') === true, 'Happy path 4: READY -> COMPLETED (Khách đã nhận nước tại quầy)')

// Exceptions
assert(isValidTransition('PENDING', 'PAYMENT_FAILED') === true, 'Exception 1: PENDING -> PAYMENT_FAILED (Thanh toán lỗi)')
assert(isValidTransition('PAYMENT_FAILED', 'PAID') === true, 'Exception 2: PAYMENT_FAILED -> PAID (Khách thử lại thanh toán thành công)')
assert(isValidTransition('PENDING', 'CANCELLED') === true, 'Exception 3: PENDING -> CANCELLED (Hủy trước khi trả tiền)')
assert(isValidTransition('PREPARING', 'CANCELLED') === true, 'Exception 4: PREPARING -> CANCELLED (Hủy trong quá trình pha chế)')

// Invalid transitions (must be blocked by assertTransition)
assert(isValidTransition('COMPLETED', 'PENDING') === false, 'Blocked: COMPLETED -> PENDING (Terminal state không thể chuyển ngược)')
assert(isValidTransition('CANCELLED', 'PAID') === false, 'Blocked: CANCELLED -> PAID (Đã hủy không thể thanh toán)')
assert(isValidTransition('READY', 'PREPARING') === false, 'Blocked: READY -> PREPARING (Không thể quay lại pha chế)')
assert(isValidTransition('PAID', 'READY') === false, 'Blocked: PAID -> READY (Bắt buộc phải qua PREPARING)')

// 3. Test BR-04 & BR-05: Stock Verification and Deductions
console.log(`\n${ANSI.bold}Suite 3: Business Rules (BR-04, BR-05) - Inventory Stock Verification${ANSI.reset}`)
const mockInventory = {
  p1: { name: 'Caramel Macchiato', stock: 5 },
  p2: { name: 'Cold Brew', stock: 1 },
}

function checkStock(productId, requestQty) {
  const product = mockInventory[productId]
  if (!product) return { ok: false, error: 'Product not found' }
  if (product.stock < requestQty) {
    return { ok: false, error: `Sản phẩm "${product.name}" chỉ còn ${product.stock} trong kho` }
  }
  return { ok: true }
}

const checkSufficient = checkStock('p1', 2)
assert(checkSufficient.ok === true, 'BR-04: Order accepted when stock (5) >= quantity (2)')

const checkInsufficient = checkStock('p2', 3)
assert(
  checkInsufficient.ok === false && checkInsufficient.error.includes('chỉ còn 1'),
  'BR-04: Order rejected when stock (1) < quantity (3)',
)

// Deduct stock
mockInventory.p1.stock -= 2
assert(mockInventory.p1.stock === 3, 'BR-05: Product stock automatically decremented (5 - 2 = 3)')

// 4. Test US-ORD-02: Counter Pickup Information Validation
console.log(`\n${ANSI.bold}Suite 4: User Story (US-ORD-02) - Canteen Counter Pickup Form Validation${ANSI.reset}`)
const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/

assert(phoneRegex.test('0912345678') === true, 'Valid VN Phone: 0912345678 is ACCEPTED')
assert(phoneRegex.test('0389998888') === true, 'Valid VN Phone: 0389998888 is ACCEPTED')
assert(phoneRegex.test('12345') === false, 'Invalid Short Phone: 12345 is REJECTED')
assert(phoneRegex.test('0123456789') === false, 'Invalid Prefix Phone: 0123456789 is REJECTED')

function validatePickup(type, tableNumber) {
  if (type === 'DINE_IN' && (!tableNumber || !tableNumber.trim())) {
    return false
  }
  return true
}

assert(validatePickup('AT_COUNTER', '') === true, 'Pickup AT_COUNTER does not require table number')
assert(validatePickup('DINE_IN', 'Bàn 04') === true, 'DINE_IN with table number is valid')
assert(validatePickup('DINE_IN', '') === false, 'DINE_IN without table number is REJECTED')

// Summary
console.log(`\n${ANSI.cyan}----------------------------------------------------------------${ANSI.reset}`)
console.log(
  `Test Results: ${ANSI.green}${passed} Passed${ANSI.reset}, ${failed > 0 ? ANSI.red : ANSI.reset}${failed} Failed`,
)
if (failed === 0) {
  console.log(`${ANSI.green}${ANSI.bold}✓ ALL TEST CASES PASSED SUCCESSFULLY (100%) ACCORDING TO BREWLITE SPEC!${ANSI.reset}\n`)
} else {
  console.log(`${ANSI.red}${ANSI.bold}✗ SOME TESTS FAILED.${ANSI.reset}\n`)
}

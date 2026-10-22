# BrewLite — Order Feature Module

**Owner:** Member 5  
**Scope:** `frontend/src/features/order/` and `frontend/src/app/checkout/`  
**Sprints:** Sprint 1 & Sprint 2

## Module Architecture

```
frontend/src/features/order/
├── components/
│   ├── OrderItemCard.tsx       # Individual coffee item card with size, quantity, subtotal
│   ├── OrderSummary.tsx        # Order summary with items, fees, discounts, and VAT
│   ├── CheckoutForm.tsx        # Delivery & shipping info form with validation & payment selector
│   └── OrderConfirmation.tsx   # Order success view with order ID, tracking, and details
├── hooks/
│   ├── useCreateOrder.ts       # Hook for submitting order & clearing cart
│   └── useOrderDetail.ts       # Hook for fetching order details and real-time status
├── services/
│   └── orderApi.ts             # API client methods with offline mock fallback
├── types/
│   └── index.ts                # TypeScript interfaces and domain models
└── index.ts                    # Public API surface
```

## Routes
- `/checkout` — Checkout flow with delivery address, payment method, order summary, and order confirmation.

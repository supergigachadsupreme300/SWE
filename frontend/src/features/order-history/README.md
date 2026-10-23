Order-History Feature Module (Member 7)

Scope: `frontend/src/features/order-history/` and `frontend/src/app/orders/`  

```
frontend/src/features/order-history/
├── components/
│   ├── OrderHistoryCard.tsx
│   ├── OrderHistoryFilters.tsx
│   ├── OrderHistoryList.tsx
│   ├── OrderHistoryDetail.tsx
│   ├── OrderHistoryDetailState.tsx
│   ├── OrderHistoryDetailPageContent.tsx
│   └── orderHistoryUtils.tsx
├── hooks/
│   ├── useOrderHistory.ts
│   └── useOrderHistoryDetail.ts
├── services/
│   └── orderHistoryApi.ts
├── types/
│   └── index.ts
├── REQUIREMENTS-SCENARIOS.md
└── index.ts

frontend/src/app/orders/
├── page.tsx
└── [id]/page.tsx

```
Features
- View order history.
- View order details.
- Search orders by order ID.
- Filter orders by status.

Routes
- `/orders` – Order history page.
- `/orders/[id]` – Order detail page.

API
- `GET /orders` – Get all orders.
- `GET /orders/:id` – Get order details.

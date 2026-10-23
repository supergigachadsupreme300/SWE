# Member 7 — Order History

## Scope

This feature implements the order history list and order detail page. It reuses the domain types from `features/order/types` and does not modify Member 5's Order & Checkout files.

## Requirements

| ID | Requirement | Priority |
|---|---|---|
| REQ-OH-01 | The system displays orders returned by the current project order data source, newest first, with order ID, creation date, total and status. | Must |
| REQ-OH-02 | The user can open an order and view its status, creation date, items, quantities, sizes, unit prices, line totals and order total. | Must |
| REQ-OH-03 | The user can search the loaded order list by order ID. | Should |
| REQ-OH-04 | The user can filter the loaded order list by order status. | Should |
| REQ-OH-05 | The interface shows loading, empty, no-results and load-error states, and provides retry when loading fails. | Must |
| REQ-OH-06 | The user can navigate from the list to a detail page and back. | Must |
| REQ-OH-07 | The feature can read existing mock orders from `brewlite_mock_orders` when the API is unavailable. | Development support |

### Project limitations to record

- The current backend `GET /orders` returns all orders because `OrdersController.findAll()` calls `findAll()` without a user ID. This is acceptable only as an unfinished-project/demo behavior, not as a production authorization model.
- The current Prisma `Order` model does not persist `customerInfo` or `paymentMethod`; the detail page therefore shows pickup/customer information only when it exists in the returned data.
- The current API has no authentication guard visible in the order controller. Do not describe the list as securely scoped to the signed-in user until backend authentication and authorization are implemented.
- Mock orders are stored in browser local storage and are only visible in that browser.

## Scenarios

### SC-OH-01 — View order history

- **Primary actor:** User.
- **Precondition:** The user opens `/orders`; backend or browser mock data may be available.
- **Main flow:**
  1. The user opens `/orders`.
  2. The system requests `GET /orders`.
  3. If the request succeeds, the system combines backend orders with local mock orders and deduplicates by ID.
  4. The system sorts orders by creation time, newest first.
  5. The system displays each order's ID, date, total and status.
- **Alternative/exception flows:**
  - 3a. If the API fails but local mock orders exist, the system displays those local orders.
  - 3b. If the API fails and no local mock orders exist, the system displays an error and a retry action.
  - 3c. If no orders are returned, the system displays an empty-state message.
- **Postcondition:** The list, empty state, or error state is visible.

### SC-OH-02 — View order details

- **Primary actor:** User.
- **Precondition:** The user selects an order from `/orders`.
- **Main flow:**
  1. The system navigates to `/orders/{id}`.
  2. The system requests `GET /orders/{id}`.
  3. The system displays the order ID, status, creation date, items and total.
  4. Available pickup/customer fields are displayed when present.
- **Alternative/exception flows:**
  - 2a. If the API fails but a matching local mock order exists, the system displays the local order.
  - 2b. If no matching order is found, the system displays an error and a link back to the list.
- **Postcondition:** Order details or an actionable error state is visible.

### SC-OH-03 — Search by order ID

- **Primary actor:** User.
- **Precondition:** The user is on `/orders`.
- **Main flow:**
  1. The user enters all or part of an order ID.
  2. The system filters the loaded list without case sensitivity.
  3. The system displays matching orders.
- **Alternative flow:** If no order matches, the system displays a no-results message. Clearing the search restores the results for the selected status filter.
- **Postcondition:** The visible list matches the search term and selected status.

### SC-OH-04 — Filter by status

- **Primary actor:** User.
- **Precondition:** The user is on `/orders`.
- **Main flow:**
  1. The user selects a status.
  2. The system filters orders by `PENDING`, `PAID`, `PREPARING`, `READY`, `COMPLETED`, `PAYMENT_FAILED`, or `CANCELLED`.
  3. The system displays matching orders.
- **Alternative flow:** If there are no matches, the system displays a no-results message. Selecting “All statuses” clears the status filter.
- **Postcondition:** The visible list reflects the selected status.

### SC-OH-05 — Retry after loading failure

- **Primary actor:** User.
- **Precondition:** A request to load order data has failed and an error message is displayed.
- **Main flow:**
  1. The user selects “Try again”.
  2. The system repeats the request.
  3. The system displays the results or the error state.
- **Postcondition:** The user can see the latest successful result or an updated error message.

### SC-OH-06 — Navigate between list and detail

- **Primary actor:** User.
- **Precondition:** The user is viewing the order list.
- **Main flow:**
  1. The user selects “View details” on an order card.
  2. The system opens `/orders/{id}`.
  3. The user selects the back-to-history link.
  4. The system returns to `/orders`.
- **Alternative flow:** If the ID is invalid or the order is missing, the detail page shows an error and offers a link back to the list.
- **Postcondition:** The user can navigate between list and detail.

## Implementation mapping

| Requirement | Files |
|---|---|
| REQ-OH-01, REQ-OH-05 | `hooks/useOrderHistory.ts`, `services/orderHistoryApi.ts`, `components/OrderHistoryList.tsx` |
| REQ-OH-02 | `hooks/useOrderHistoryDetail.ts`, `components/OrderHistoryDetail.tsx` |
| REQ-OH-03, REQ-OH-04 | `components/OrderHistoryFilters.tsx`, `hooks/useOrderHistory.ts` |
| REQ-OH-06 | `app/orders/page.tsx`, `app/orders/[id]/page.tsx` |
| REQ-OH-07 | `services/orderHistoryApi.ts` |

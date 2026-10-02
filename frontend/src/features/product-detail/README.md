# Product Detail feature (Member 3)

Scope: `src/features/product-detail/` and `src/app/products/[id]/page.tsx`.
Nothing outside those paths is modified by this feature.

## Public API

```ts
import {
  ProductDetailCard,
  RelatedProducts,
  useProductDetail,
  useAddToCart,
  fetchProductDetail,
  fetchRelatedProducts,
  formatPrice,
} from '@/features/product-detail'
```

## Structure

| Path | Responsibility |
| --- | --- |
| `types/index.ts` | `ProductDetail`, `RelatedProduct`, hook results, cart bridge contract |
| `services/productDetailService.ts` | `GET /products/:id`, `GET /products/:id/related?limit=n` via `src/services/api` |
| `services/normalize.ts` | Defensive mapping of API payloads (`imageUrl` or `images[]`) to `ProductDetail` |
| `services/mockProductDetail.ts` | Mock catalogue used while the backend endpoints are placeholders |
| `hooks/useProductDetail.ts` | `useProductDetail(id, { relatedLimit })` → `{ product, relatedProducts, loading, error, reload }` |
| `hooks/useAddToCart.ts` | Hands the item to the cart feature (see below) |
| `components/ProductGallery.tsx` | Main image + thumbnail switcher |
| `components/ProductInfo.tsx` | Name, brand/category, price, description |
| `components/StockBadge.tsx` | Stock state badge (`in-stock`, `low-stock`, `out-of-stock`) |
| `components/QuantitySelector.tsx` | Quantity stepper, capped by available stock |
| `components/AddToCartButton.tsx` | Quantity + submit, delegates to the cart feature |
| `components/RelatedProducts.tsx` | Grid of `RelatedProduct` linking to `/products/:id` |
| `components/ProductDetailCard.tsx` | Composes the above, owns loading/error/empty states |
| `utils/formatPrice.ts` | `Intl.NumberFormat` money formatting |

## Backend contract

```
GET /products/:id                 -> Product  (id, name, description?, imageUrl?, price, stock, createdAt)
GET /products/:id/related?limit=n -> Product[] with { id, name, price, imageUrl? }
```

`imageUrl` (Prisma) and `images[]` are both accepted and normalised to `ProductDetail.images`.

## Cart integration contract (Member 4)

This feature never implements cart logic. `AddToCartButton` calls `useAddToCart()`, which
resolves the cart feature in this order:

1. `window.__BREWLITE_CART__.addToCart(item)` — if the cart module registered a bridge.
2. Otherwise a DOM event `brewlite:add-to-cart` is dispatched on `window`
   with `event.detail === { productId, quantity }`.

Register from the cart feature (preferred, gives real feedback in the button):

```ts
'use client'
import { registerCartBridge } from '@/features/product-detail'

// in the cart provider / layout that Member 4 owns
registerCartBridge((item) => useCartStore.getState().addItem(item.productId, item.quantity))
```

Or listen to the event:

```ts
window.addEventListener('brewlite:add-to-cart', (event) => {
  const { productId, quantity } = (event as CustomEvent).detail
  // forward to cart logic
})
```

Until a bridge is registered the button reports
`Add-to-cart dispatched. The cart feature is not connected yet.`
instead of faking a successful add.

## Environment

| Variable | Default | Meaning |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend base URL (shared client) |
| `NEXT_PUBLIC_PRODUCT_DETAIL_MOCK` | `true` | Fall back to mock data when the API fails. Set to `false` once the backend endpoints exist. |
| `NEXT_PUBLIC_CURRENCY` | `VND` | ISO currency used by `formatPrice` |
| `NEXT_PUBLIC_CURRENCY_LOCALE` | `vi-VN` | Locale used by `formatPrice` |

Mock product ids: `mock-cappuccino`, `mock-matcha-latte`, `mock-cold-brew`,
`mock-viet-pho-coffee`, `mock-mocha`.

## Local check

```bash
cd frontend
npm install
npm run dev          # then open http://localhost:3000/products/mock-cappuccino
npx tsc --noEmit
```

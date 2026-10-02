# Products module

Product detail endpoints (Member 3). The product list endpoint (`GET /products`) is still a
placeholder and belongs to the product-list owner.

## Endpoints

```
GET /products/:id                  -> 200 ProductDetail | 404
GET /products/:id/related?limit=n  -> 200 ProductDetail[] | 404
```

`limit` defaults to 4 and is clamped to 1..12. A non-numeric value falls back to the default.
`404` is raised when the requested product does not exist, including for `/related`.

## Response shape

Both endpoints return the same selection (`PRODUCT_DETAIL_SELECT` in `products.service.ts`):

```json
{
  "id": "clx123",
  "name": "Cappuccino",
  "description": "Double espresso steamed with milk",
  "imageUrl": "https://cdn.brewlite.vn/cappuccino.jpg",
  "price": 45000,
  "stock": 24,
  "createdAt": "2026-01-12T02:00:00.000Z"
}
```

The frontend normaliser in `frontend/src/features/product-detail/services/normalize.ts` also
accepts an `images[]` array, so a multi-image product can be returned under either key.

Related products exclude the product itself and are ordered by `createdAt desc, id asc`.
`Product` has no category column yet, so "related" currently means "other products". When a
category column is added, filter the `where` clause in `findRelated` by the shared category.

## Files

| File | Role |
| --- | --- |
| `products.controller.ts` | Route definitions, `limit` defaults |
| `products.service.ts` | Prisma queries, `NotFoundException`, response selection |
| `products.module.ts` | Imports `PrismaModule` for the `PrismaService` injection |

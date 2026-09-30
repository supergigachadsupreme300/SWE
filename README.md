Further docs: see `docs/TEAM_GIT_WORKFLOW.md`.

## Frontend structure (detailed)

The frontend code lives in `frontend/src`. Team members should work inside their assigned feature folder (see ownership mapping below).

frontend/src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── products/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   ├── payment/page.tsx
│   └── orders/
│       ├── page.tsx
│       ├── [id]/page.tsx
│       └── confirmation/page.tsx
|
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/index.ts
│   │   └── index.ts
│   ├── product/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/index.ts
│   │   └── index.ts
│   ├── product-detail/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/index.ts
│   │   └── index.ts
│   ├── cart/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── stores/
│   │   ├── services/
│   │   ├── types/index.ts
│   │   └── index.ts
│   ├── order/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/index.ts
│   │   └── index.ts
│   ├── payment/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/index.ts
│   │   └── index.ts
│   └── order-history/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types/index.ts
│       └── index.ts
|
├── components/
│   ├── ui/
│   ├── layout/
│   └── common/
|
├── services/
│   └── api/index.ts
|
├── hooks/
├── stores/
├── types/
└── lib/

### Ownership mapping (7 members)
- Member 1 (auth): `features/auth/` and `app/auth/` (login/register)
- Member 2 (product): `features/product/` and `app/products/` (product list)
- Member 3 (product-detail): `features/product-detail/` and `app/products/[id]/` (product details)
- Member 4 (cart): `features/cart/` and `app/cart/` (cart functionality)
- Member 5 (order): `features/order/` and `app/checkout/` (checkout flow)
- Member 6 (payment): `features/payment/` and `app/payment/` (payment flow)
- Member 7 (order-history): `features/order-history/` and `app/orders/` (orders & history)

Follow the repository rules: shared API client in `src/services/api/`, shared UI in `src/components/`, and each feature should export a public surface from `index.ts`.
# BrewLite

BrewLite is a university Software Engineering project: a minimal e-commerce prototype for learning full-stack development.

Tech stack
- Frontend: Next.js (App Router) + React + TypeScript + TailwindCSS + Zustand
- Backend: NestJS + TypeScript + Prisma (PostgreSQL)
- Database: PostgreSQL (Docker Compose)
- API: REST/JSON
- Dev: Docker Compose, npm

Folder structure

```
BrewLite/
├── frontend/
├── backend/
├── docker-compose.yml
├── .gitignore
├── .env.example
├── README.md
└── docs/
```

Requirements
- Node.js (18+ recommended)
- npm
- Docker & Docker Compose (for running full stack)

Install dependencies (frontend and backend)

```bash
cd frontend
npm install

cd ../backend
npm install
```

Run frontend

```bash
cd frontend
npm run dev
# Open http://localhost:3000
```

Run backend

```bash
cd backend
npm run start:dev
# Backend listens on port 8000 by default
```

Run PostgreSQL (Docker Compose)

```bash
docker compose up -d db
```

Run entire stack (frontend, backend, db)

```bash
docker compose up --build
```

Prisma
- Schema: `backend/prisma/schema.prisma`
- To generate client after DB is up:

```bash
cd backend
npx prisma generate
```

Git workflow (team)

Branches:
- `main` — protected main branch
- `feature/<feature-name>` — feature branches (examples: `feature/auth`, `feature/product`)

Suggested process:
1. Pull the latest `main`.
2. Create `feature/<feature-name>` branch.
3. Implement feature locally.
4. Commit with clear messages.
5. Push branch and open a Pull Request.
6. Another team member reviews the PR.
7. Merge into `main` after approval.

Further docs: see `docs/TEAM_GIT_WORKFLOW.md`.

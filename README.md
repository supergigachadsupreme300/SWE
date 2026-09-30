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

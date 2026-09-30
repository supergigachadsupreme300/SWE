# Team Git Workflow

Use the following lightweight workflow for 7 developers collaborating on BrewLite.

Branches
- `main` — stable main branch. Protect this branch and require PR reviews.
- `feature/<feature-name>` — feature branches created from `main`.

Examples:
- `feature/auth`
- `feature/product`
- `feature/cart`

Member steps
1. `git checkout main` && `git pull origin main`
2. `git checkout -b feature/<feature-name>`
3. Work on assigned feature only.
4. Commit often with clear messages: `feat(product): add product list shell`.
5. Push: `git push origin feature/<feature-name>`
6. Open Pull Request into `main`.
7. Assign reviewer and wait for approval.
8. After approval, merge and pull `main` locally.

Code review
- At least one approving review required.
- Keep changes small and scoped to the feature.

Notes
- Rebase locally before pushing if needed: `git rebase origin/main`.
- Avoid long-lived feature branches; keep them short-lived and frequently sync with `main`.

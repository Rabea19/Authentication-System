# README and CI Implementation Plan

## Goal

Create a professional root README and a GitHub Actions CI workflow for the Authentication System repository.

## Task 1: Root README

Create:

`README.md`

The README will:

- Explain the project.
- List authentication features.
- List security features.
- Describe the technology stack.
- Show the project structure.
- Document API endpoints.
- Explain required environment variables.
- Explain installation and local development.
- Explain backend and frontend testing.
- Explain the frontend production build.
- Include future improvement ideas.
- Never include real secrets or credentials.

After creating the README:

```bash
git add README.md
git commit -m "docs: add project README"
```

## Task 2: GitHub Actions CI

Create:

`.github/workflows/ci.yml`

The workflow will run on:

- Push to `main`.
- Pull requests targeting `main`.

The backend CI job will:

```bash
cd server
npm ci
npm test
```

The frontend CI job will:

```bash
cd client
npm ci
npx vitest run
npm run build
```

No real `.env` files or production secrets will be stored inside the workflow.

After creating the workflow:

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add automated test workflow"
```

## Task 3: Final Verification

Run backend tests:

```bash
cd server
npm test
```

Run frontend tests and build:

```bash
cd client
npx vitest run
npm run build
```

Then check Git:

```bash
git status
```

Finally push the commits:

```bash
git push
```

## Success Criteria

- Root README exists.
- README is written in English.
- No real credentials appear in documentation.
- Backend tests run automatically on GitHub.
- Frontend tests run automatically on GitHub.
- Frontend production build runs automatically on GitHub.
- Local backend tests still pass.
- Local frontend tests still pass.
- Local frontend build still succeeds.

# README and CI Design

## Goal

Prepare the Authentication System repository for professional GitHub presentation and automated quality checks.

## README

Create a root-level `README.md` written in English.

It will include:

- Project overview
- Main authentication features
- Security features
- Technology stack
- Project structure
- API endpoints
- Environment variables
- Installation instructions
- How to run the backend
- How to run the frontend
- Testing instructions
- Production build instructions
- Future improvements

No real passwords, tokens, MongoDB URLs, JWT secrets, or Mailtrap credentials will be included.

## GitHub Actions CI

Create:

`.github/workflows/ci.yml`

The workflow will run automatically on:

- Push to `main`
- Pull requests targeting `main`

### Backend

The workflow will:

1. Install backend dependencies.
2. Run backend tests with `npm test`.

### Frontend

The workflow will:

1. Install frontend dependencies.
2. Run frontend tests with `npx vitest run`.
3. Run the production build with `npm run build`.

## Success Criteria

The repository will have:

- A professional English README.
- Automated backend testing.
- Automated frontend testing.
- Automated frontend production build verification.
- No committed secrets or private environment variables.

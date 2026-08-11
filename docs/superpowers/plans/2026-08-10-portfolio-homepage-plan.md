# Portfolio Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the existing authentication homepage into a polished portfolio project page for Rabea Saad while preserving all current authentication functionality.

**Architecture:** Keep the existing React authentication architecture unchanged and redesign only the presentation layer of the homepage. `Home.jsx` will continue owning the Login / Sign Up state and authentication handlers, while portfolio copy, project features, contact links, and the live demo presentation are added around the existing flow. Motion will use lightweight CSS and Tailwind utilities instead of adding an animation dependency.

**Tech Stack:** React 19, React Router, Tailwind CSS 4, Vite 8, Vitest, Testing Library.

## Global Constraints

- Developer name: `Rabea Saad`.
- Developer role: `Full-Stack JavaScript Developer`.
- GitHub: `https://github.com/Rabea19`.
- LinkedIn: `https://www.linkedin.com/in/rabea-saad-3a893a2b1`.
- Email: `rabeasaadrabea199555@gmail.com`.
- Keep the current Login / Sign Up form on the homepage.
- Preserve Login, Sign Up, Forgot Password, validation, error handling, and successful navigation behavior.
- Do not change backend authentication behavior.
- Keep React and the existing project architecture.
- Keep Tailwind CSS styling.
- Do not add an animation library.
- Preserve all current routes.
- Support mobile, tablet, and desktop.
- Preserve semantic headings and associated form labels.
- Preserve visible focus states.
- Decorative animation must not interfere with assistive technology.
- Respect `prefers-reduced-motion`.
- Existing authentication tests must remain green.
- Frontend production build must succeed.
- GitHub CI must remain green after integration.

---

## File Structure

### Files to modify

- `client/src/pages/Home.jsx`
  - Developer portfolio identity.
  - Project overview.
  - Portfolio links.
  - Project feature cards.
  - Live Authentication Demo presentation.
  - Existing Login / Sign Up logic remains here.

- `client/src/index.css`
  - Portfolio entrance animation.
  - Floating decorative animation.
  - Background visual treatment.
  - Reduced-motion accessibility rules.

### File to create

- `client/src/pages/Home.test.jsx`
  - Portfolio identity tests.
  - Contact link tests.
  - Project feature tests.
  - Authentication demo UI regression tests.

### Files that must not change

- `server/**`
- `client/src/api/**`
- `client/src/context/AuthContext.jsx`
- Existing authentication route behavior.

---

### Task 1: Add Homepage Portfolio Regression Tests

**Files:**
- Create: `client/src/pages/Home.test.jsx`
- Read: `client/src/pages/Home.jsx`

**Interfaces:**
- Consumes: `Home` default export from `./Home.jsx`.
- Consumes: `useAuth()` from `../context/AuthContext.jsx`.
- Produces: automated regression coverage for the redesigned homepage.

- [ ] **Step 1: Create the homepage test file**

Create `client/src/pages/Home.test.jsx` with:

```jsx
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router";

import Home from "./Home.jsx";

const authMocks = vi.hoisted(() => ({
  login: vi.fn(),
  register: vi.fn(),
}));

vi.mock("../context/AuthContext.jsx", () => ({
  useAuth: () => ({
    login: authMocks.login,
    register: authMocks.register,
  }),
}));

const renderHome = () => {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );
};

describe("Home portfolio page", () => {
  beforeEach(() => {
    authMocks.login.mockReset();
    authMocks.register.mockReset();
  });

  it("presents Rabea Saad and the portfolio project identity", () => {
    renderHome();

    expect(screen.getByText("Rabea Saad")).toBeTruthy();
    expect(screen.getByText("Full-Stack JavaScript Developer")).toBeTruthy();
    expect(screen.getByText("About This Project")).toBeTruthy();
    expect(screen.getByText("Try the Live Authentication Demo")).toBeTruthy();
  });

  it("provides GitHub, LinkedIn, and email contact links", () => {
    renderHome();

    const githubLink = screen.getByRole("link", { name: /github/i });
    const linkedinLink = screen.getByRole("link", { name: /linkedin/i });
    const emailLink = screen.getByRole("link", { name: /email/i });

    expect(githubLink.getAttribute("href")).toBe(
      "https://github.com/Rabea19",
    );

    expect(linkedinLink.getAttribute("href")).toBe(
      "https://www.linkedin.com/in/rabea-saad-3a893a2b1",
    );

    expect(emailLink.getAttribute("href")).toBe(
      "mailto:rabeasaadrabea199555@gmail.com",
    );
  });

  it("shows the main authentication project capabilities", () => {
    renderHome();

    expect(screen.getByText("Secure Authentication")).toBeTruthy();
    expect(screen.getByText("Email Verification")).toBeTruthy();
    expect(screen.getByText("Password Recovery")).toBeTruthy();
    expect(screen.getByText("Protected Routes")).toBeTruthy();
    expect(screen.getByText("Security Middleware")).toBeTruthy();
    expect(screen.getByText("Automated Testing & CI")).toBeTruthy();
  });

  it("keeps the Login and Sign Up experience available", () => {
    renderHome();

    expect(screen.getByRole("button", { name: "Login" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    expect(
      screen.getByRole("heading", { name: "Create account" }),
    ).toBeTruthy();

    expect(screen.getByLabelText("Full Name")).toBeTruthy();
    expect(screen.getByLabelText("Email")).toBeTruthy();
    expect(screen.getByLabelText("Password")).toBeTruthy();
    expect(screen.getByLabelText("Confirm Password")).toBeTruthy();
  });

  it("keeps Forgot Password available in Login mode", () => {
    renderHome();

    expect(
      screen.getByRole("button", { name: "Forgot password?" }),
    ).toBeTruthy();
  });
});
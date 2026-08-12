// @vitest-environment jsdom

import { afterEach, describe, expect, test, vi } from "vitest";

import { cleanup, render, screen } from "@testing-library/react";

import { MemoryRouter } from "react-router";

import { useAuth } from "./context/AuthContext.jsx";

import App from "./App.jsx";

vi.mock("./context/AuthContext.jsx", () => ({
  useAuth: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("App routing", () => {
  test("shows Home page on root route", () => {
    useAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", {
        name: /authentication system/i,
      }),
    ).toBeTruthy();
  });

  test("shows Dashboard for authenticated user", () => {
    useAuth.mockReturnValue({
      user: {
        id: "user-123",
        name: "Rabea",
        email: "rabea@example.com",
        role: "user",
        isVerified: true,
      },
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", {
        name: /welcome, rabea/i,
      }),
    ).toBeTruthy();
  });

  test("shows Verify Email page on verify route", () => {
    useAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/verify-email",
            state: {
              email: "rabea@example.com",
            },
          },
        ]}
      >
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", {
        name: /verify your email/i,
      }),
    ).toBeTruthy();

    expect(screen.getByText("rabea@example.com")).toBeTruthy();
  });

  test("shows Forgot Password page on forgot password route", () => {
    useAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={["/forgot-password"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", {
        name: /forgot password/i,
      }),
    ).toBeTruthy();

    expect(
      screen.getByRole("button", {
        name: /send reset link/i,
      }),
    ).toBeTruthy();
  });

  test("shows Reset Password page on reset password route", () => {
    useAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={["/reset-password?token=abc123"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", {
        name: /reset password/i,
      }),
    ).toBeTruthy();

    expect(screen.getByLabelText(/new password/i)).toBeTruthy();

    expect(screen.getByLabelText(/confirm password/i)).toBeTruthy();
  });

  test("shows Change Password page for authenticated user", () => {
    useAuth.mockReturnValue({
      user: {
        id: "user-123",
        name: "Rabea",
        email: "rabea@example.com",
        role: "user",
        isVerified: true,
      },
      loading: false,
      changePassword: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/change-password"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", {
        name: /change password/i,
      }),
    ).toBeTruthy();

    expect(screen.getByLabelText(/current password/i)).toBeTruthy();
  });
});

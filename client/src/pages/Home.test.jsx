// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";

import { MemoryRouter, Route, Routes } from "react-router";

import { useAuth } from "../context/AuthContext.jsx";

import Home from "./Home.jsx";

vi.mock("../context/AuthContext.jsx", () => ({
  useAuth: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();

  useAuth.mockReturnValue({
    login: vi.fn(),
    register: vi.fn(),
  });
});

afterEach(() => {
  cleanup();
});

describe("Home page", () => {
  test("shows the about section and login form", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", {
        name: /welcome/i,
      }),
    ).toBeTruthy();

    expect(screen.getByText(/about/i)).toBeTruthy();

    const emailInput = screen.getByLabelText(/email/i);

    expect(emailInput).toBeTruthy();

    expect(screen.getByLabelText(/password/i)).toBeTruthy();

    const loginForm = emailInput.closest("form");

    expect(loginForm).toBeTruthy();

    expect(
      within(loginForm).getByRole("button", {
        name: /^login$/i,
      }),
    ).toBeTruthy();

    expect(
      screen.getByRole("button", {
        name: /sign up/i,
      }),
    ).toBeTruthy();
  });

  test("logs in and navigates to dashboard", async () => {
    const login = vi.fn().mockResolvedValue({
      success: true,
      data: {
        user: {
          id: "user-123",
          name: "Rabea",
          email: "rabea@example.com",
        },
      },
    });

    useAuth.mockReturnValue({
      login,
      register: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/dashboard" element={<h1>Dashboard Test</h1>} />
        </Routes>
      </MemoryRouter>,
    );

    const emailInput = screen.getByLabelText(/email/i);

    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, {
      target: {
        value: "rabea@example.com",
      },
    });

    fireEvent.change(passwordInput, {
      target: {
        value: "Rabea@123",
      },
    });

    const loginForm = emailInput.closest("form");

    fireEvent.submit(loginForm);

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: "rabea@example.com",
        password: "Rabea@123",
      });
    });

    expect(
      await screen.findByRole("heading", {
        name: "Dashboard Test",
      }),
    ).toBeTruthy();
  });

  test("registers new user and navigates to verify email", async () => {
    const register = vi.fn().mockResolvedValue({
      success: true,
      message: "Registration successful",
      data: {
        user: {
          id: "user-123",
          name: "Rabea",
          email: "rabea@example.com",
          isVerified: false,
          role: "user",
        },
      },
    });

    useAuth.mockReturnValue({
      login: vi.fn(),
      register,
    });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/verify-email" element={<h1>Verify Email Test</h1>} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /sign up/i,
      }),
    );

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: {
        value: "Rabea",
      },
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: {
        value: "rabea@example.com",
      },
    });

    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: {
        value: "Rabea@123",
      },
    });

    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: {
        value: "Rabea@123",
      },
    });

    const form = screen.getByLabelText(/email/i).closest("form");

    fireEvent.submit(form);

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith({
        name: "Rabea",
        email: "rabea@example.com",
        password: "Rabea@123",
        confirmPassword: "Rabea@123",
      });
    });

    expect(
      await screen.findByRole("heading", {
        name: "Verify Email Test",
      }),
    ).toBeTruthy();
  });

  test("navigates to forgot password page", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/forgot-password"
            element={<h1>Forgot Password Test</h1>}
          />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /forgot password/i,
      }),
    );

    expect(
      await screen.findByRole("heading", {
        name: "Forgot Password Test",
      }),
    ).toBeTruthy();
  });
});

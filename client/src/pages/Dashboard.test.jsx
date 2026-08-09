// @vitest-environment jsdom

import { afterEach, describe, expect, test, vi } from "vitest";

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import { MemoryRouter, Route, Routes } from "react-router";

import { useAuth } from "../context/AuthContext.jsx";

import Dashboard from "./Dashboard.jsx";

vi.mock("../context/AuthContext.jsx", () => ({
  useAuth: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const mockUser = {
  id: "user-123",
  name: "Rabea",
  email: "rabea@example.com",
  role: "user",
  isVerified: true,
};

describe("Dashboard page", () => {
  test("shows the logged in user information", () => {
    useAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", {
        name: /welcome, rabea/i,
      }),
    ).toBeTruthy();

    const emailElements = screen.getAllByText("rabea@example.com");

    expect(emailElements.length).toBeGreaterThan(0);

    expect(
      screen.getByRole("button", {
        name: /change password/i,
      }),
    ).toBeTruthy();

    expect(
      screen.getByRole("button", {
        name: /^logout$/i,
      }),
    ).toBeTruthy();
  });

  test("logs out and navigates to home", async () => {
    const logout = vi.fn().mockResolvedValue({
      success: true,
      message: "Logout successful",
    });

    useAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      logout,
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/" element={<h1>Home Test</h1>} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /^logout$/i,
      }),
    );

    await waitFor(() => {
      expect(logout).toHaveBeenCalledTimes(1);
    });

    expect(
      await screen.findByRole("heading", {
        name: "Home Test",
      }),
    ).toBeTruthy();
  });

  test("navigates to change password page", async () => {
    useAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route
            path="/change-password"
            element={<h1>Change Password Test</h1>}
          />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /change password/i,
      }),
    );

    expect(
      await screen.findByRole("heading", {
        name: "Change Password Test",
      }),
    ).toBeTruthy();
  });
});

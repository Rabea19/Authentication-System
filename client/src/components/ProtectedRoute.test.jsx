// @vitest-environment jsdom

import { afterEach, describe, expect, test, vi } from "vitest";

import { cleanup, render, screen } from "@testing-library/react";

import { MemoryRouter, Route, Routes } from "react-router";

import { useAuth } from "../context/AuthContext.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";

vi.mock("../context/AuthContext.jsx", () => ({
  useAuth: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("ProtectedRoute", () => {
  test("shows protected content for authenticated user", () => {
    useAuth.mockReturnValue({
      user: {
        id: "user-123",
        name: "Rabea",
      },
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <p>Dashboard</p>
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<p>Home</p>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Dashboard")).toBeTruthy();
  });

  test("redirects guest user to home", () => {
    useAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <p>Dashboard</p>
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<p>Home</p>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Home")).toBeTruthy();
  });

  test("shows loading state while authentication is loading", () => {
    useAuth.mockReturnValue({
      user: null,
      loading: true,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <p>Dashboard</p>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    expect(screen.getByText("Loading...")).toBeTruthy();
  });
});

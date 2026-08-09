// @vitest-environment jsdom

import { afterEach, describe, expect, test, vi } from "vitest";

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import {
  changePassword as changePasswordRequest,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../api/authApi.js";

import { AuthProvider, useAuth } from "./AuthContext.jsx";

vi.mock("../api/authApi.js", () => ({
  getCurrentUser: vi.fn(),
  loginUser: vi.fn(),
  logoutUser: vi.fn(),
  registerUser: vi.fn(),
  changePassword: vi.fn(),
}));

const TestComponent = () => {
  const { user, loading, login, logout, register, changePassword } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <p>{user ? user.name : "Guest"}</p>

      <button
        type="button"
        onClick={() =>
          login({
            email: "rabea@example.com",
            password: "Rabea@123",
          })
        }
      >
        Login Test User
      </button>

      <button
        type="button"
        onClick={() =>
          register({
            name: "Rabea",
            email: "rabea@example.com",
            password: "Rabea@123",
            confirmPassword: "Rabea@123",
          })
        }
      >
        Register Test User
      </button>

      <button type="button" onClick={() => logout()}>
        Logout Test User
      </button>

      <button
        type="button"
        onClick={() =>
          changePassword({
            currentPassword: "Rabea@123",
            newPassword: "NewPassword@123",
            confirmPassword: "NewPassword@123",
          })
        }
      >
        Change Password Test
      </button>
    </div>
  );
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("AuthContext", () => {
  test("loads the current user when AuthProvider starts", async () => {
    getCurrentUser.mockResolvedValue({
      success: true,
      data: {
        user: {
          id: "user-123",
          name: "Rabea",
          email: "rabea@example.com",
          role: "user",
          isVerified: true,
        },
      },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByText("Loading...")).toBeTruthy();

    expect(await screen.findByText("Rabea")).toBeTruthy();
  });

  test("login signs in user and updates context", async () => {
    getCurrentUser.mockRejectedValue(new Error("Unauthorized"));

    loginUser.mockResolvedValue({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: "user-123",
          name: "Rabea",
          email: "rabea@example.com",
          role: "user",
          isVerified: true,
        },
      },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(await screen.findByText("Guest")).toBeTruthy();

    fireEvent.click(
      screen.getByRole("button", {
        name: /login test user/i,
      }),
    );

    expect(await screen.findByText("Rabea")).toBeTruthy();

    expect(loginUser).toHaveBeenCalledWith({
      email: "rabea@example.com",
      password: "Rabea@123",
    });
  });

  test("register sends new user data without logging the user in", async () => {
    getCurrentUser.mockRejectedValue(new Error("Unauthorized"));

    registerUser.mockResolvedValue({
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

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(await screen.findByText("Guest")).toBeTruthy();

    fireEvent.click(
      screen.getByRole("button", {
        name: /register test user/i,
      }),
    );

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith({
        name: "Rabea",
        email: "rabea@example.com",
        password: "Rabea@123",
        confirmPassword: "Rabea@123",
      });
    });

    expect(screen.getByText("Guest")).toBeTruthy();
  });

  test("logout clears the authenticated user", async () => {
    getCurrentUser.mockResolvedValue({
      success: true,
      data: {
        user: {
          id: "user-123",
          name: "Rabea",
          email: "rabea@example.com",
          role: "user",
          isVerified: true,
        },
      },
    });

    logoutUser.mockResolvedValue({
      success: true,
      message: "Logout successful",
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(await screen.findByText("Rabea")).toBeTruthy();

    fireEvent.click(
      screen.getByRole("button", {
        name: /logout test user/i,
      }),
    );

    await waitFor(() => {
      expect(logoutUser).toHaveBeenCalledTimes(1);
    });

    expect(await screen.findByText("Guest")).toBeTruthy();
  });

  test("changePassword clears user after successful password change", async () => {
    getCurrentUser.mockResolvedValue({
      success: true,
      data: {
        user: {
          id: "user-123",
          name: "Rabea",
          email: "rabea@example.com",
          role: "user",
          isVerified: true,
        },
      },
    });

    changePasswordRequest.mockResolvedValue({
      success: true,
      message: "Password changed successfully. Please log in again.",
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(await screen.findByText("Rabea")).toBeTruthy();

    fireEvent.click(
      screen.getByRole("button", {
        name: /change password test/i,
      }),
    );

    await waitFor(() => {
      expect(changePasswordRequest).toHaveBeenCalledWith({
        currentPassword: "Rabea@123",
        newPassword: "NewPassword@123",
        confirmPassword: "NewPassword@123",
      });
    });

    expect(await screen.findByText("Guest")).toBeTruthy();
  });
});

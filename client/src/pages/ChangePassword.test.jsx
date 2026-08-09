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

import ChangePassword from "./ChangePassword.jsx";

vi.mock("../context/AuthContext.jsx", () => ({
  useAuth: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Change Password page", () => {
  test("changes password and navigates to home", async () => {
    const changePassword = vi.fn().mockResolvedValue({
      success: true,
      message: "Password changed successfully. Please log in again.",
    });

    useAuth.mockReturnValue({
      user: {
        id: "user-123",
        name: "Rabea",
        email: "rabea@example.com",
      },
      changePassword,
    });

    render(
      <MemoryRouter initialEntries={["/change-password"]}>
        <Routes>
          <Route path="/change-password" element={<ChangePassword />} />

          <Route path="/" element={<h1>Home Test</h1>} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/current password/i), {
      target: {
        value: "Rabea@123",
      },
    });

    fireEvent.change(screen.getByLabelText(/^new password$/i), {
      target: {
        value: "NewPassword@123",
      },
    });

    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: {
        value: "NewPassword@123",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /^change password$/i,
      }),
    );

    await waitFor(() => {
      expect(changePassword).toHaveBeenCalledWith({
        currentPassword: "Rabea@123",
        newPassword: "NewPassword@123",
        confirmPassword: "NewPassword@123",
      });
    });

    expect(
      await screen.findByRole("heading", {
        name: "Home Test",
      }),
    ).toBeTruthy();
  });
});

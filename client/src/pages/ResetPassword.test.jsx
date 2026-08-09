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

import { resetPassword } from "../api/authApi.js";

import ResetPassword from "./ResetPassword.jsx";

vi.mock("../api/authApi.js", () => ({
  resetPassword: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Reset Password page", () => {
  test("resets password using token from URL and returns to home", async () => {
    resetPassword.mockResolvedValue({
      success: true,
      message: "Password reset successfully",
    });

    render(
      <MemoryRouter initialEntries={["/reset-password?token=abc123"]}>
        <Routes>
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/" element={<h1>Home Test</h1>} />
        </Routes>
      </MemoryRouter>,
    );

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
        name: /reset password/i,
      }),
    );

    await waitFor(() => {
      expect(resetPassword).toHaveBeenCalledWith({
        token: "abc123",
        password: "NewPassword@123",
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

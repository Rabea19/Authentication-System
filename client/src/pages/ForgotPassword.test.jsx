// @vitest-environment jsdom

import { afterEach, describe, expect, test, vi } from "vitest";

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import { MemoryRouter } from "react-router";

import { forgotPassword } from "../api/authApi.js";

import ForgotPassword from "./ForgotPassword.jsx";

vi.mock("../api/authApi.js", () => ({
  forgotPassword: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Forgot Password page", () => {
  test("sends reset request and shows success message", async () => {
    forgotPassword.mockResolvedValue({
      success: true,
      message:
        "If an account exists for this email, a password reset link has been sent.",
    });

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: {
        value: "rabea@example.com",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /send reset link/i,
      }),
    );

    await waitFor(() => {
      expect(forgotPassword).toHaveBeenCalledWith({
        email: "rabea@example.com",
      });
    });

    const statusMessage = await screen.findByRole("status");

    expect(statusMessage.textContent).toContain(
      "If an account exists for this email",
    );
  });
});

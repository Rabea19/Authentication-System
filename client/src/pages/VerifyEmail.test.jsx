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

import { verifyEmail, resendVerificationCode } from "../api/authApi.js";

import VerifyEmail from "./VerifyEmail.jsx";

vi.mock("../api/authApi.js", () => ({
  verifyEmail: vi.fn(),
  resendVerificationCode: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Verify Email page", () => {
  test("verifies email and navigates back to home", async () => {
    verifyEmail.mockResolvedValue({
      success: true,
      message: "Email verified successfully",
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
        <Routes>
          <Route path="/verify-email" element={<VerifyEmail />} />

          <Route path="/" element={<h1>Home Test</h1>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("rabea@example.com")).toBeTruthy();

    fireEvent.change(screen.getByLabelText(/verification code/i), {
      target: {
        value: "123456",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /^verify email$/i,
      }),
    );

    await waitFor(() => {
      expect(verifyEmail).toHaveBeenCalledWith({
        email: "rabea@example.com",
        code: "123456",
      });
    });

    expect(
      await screen.findByRole("heading", {
        name: "Home Test",
      }),
    ).toBeTruthy();
  });

  test("resends verification code", async () => {
    resendVerificationCode.mockResolvedValue({
      success: true,
      message: "If verification is required, a new code has been sent.",
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
        <VerifyEmail />
      </MemoryRouter>,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /resend code/i,
      }),
    );

    await waitFor(() => {
      expect(resendVerificationCode).toHaveBeenCalledWith({
        email: "rabea@example.com",
      });
    });
  });
});

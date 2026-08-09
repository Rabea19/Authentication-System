import { beforeEach, describe, expect, test, vi } from "vitest";

import apiClient from "./apiClient.js";

import {
  registerUser,
  verifyEmail,
  resendVerificationCode,
  loginUser,
  getCurrentUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  changePassword,
} from "./authApi.js";

vi.mock("./apiClient.js", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("authApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("registerUser sends register data", async () => {
    const userData = {
      name: "Rabea",
      email: "rabea@example.com",
      password: "Rabea@123",
      confirmPassword: "Rabea@123",
    };

    const responseData = {
      success: true,
    };

    apiClient.post.mockResolvedValue({
      data: responseData,
    });

    const result = await registerUser(userData);

    expect(apiClient.post).toHaveBeenCalledWith("/auth/register", userData);

    expect(result).toEqual(responseData);
  });

  test("verifyEmail sends email and code", async () => {
    const data = {
      email: "rabea@example.com",
      code: "123456",
    };

    apiClient.post.mockResolvedValue({
      data: {
        success: true,
      },
    });

    await verifyEmail(data);

    expect(apiClient.post).toHaveBeenCalledWith("/auth/verify-email", data);
  });

  test("resendVerificationCode sends email", async () => {
    const data = {
      email: "rabea@example.com",
    };

    apiClient.post.mockResolvedValue({
      data: {
        success: true,
      },
    });

    await resendVerificationCode(data);

    expect(apiClient.post).toHaveBeenCalledWith(
      "/auth/resend-verification-code",
      data,
    );
  });

  test("loginUser sends login credentials", async () => {
    const data = {
      email: "rabea@example.com",
      password: "Rabea@123",
    };

    apiClient.post.mockResolvedValue({
      data: {
        success: true,
      },
    });

    await loginUser(data);

    expect(apiClient.post).toHaveBeenCalledWith("/auth/login", data);
  });

  test("getCurrentUser gets authenticated user", async () => {
    apiClient.get.mockResolvedValue({
      data: {
        success: true,
      },
    });

    await getCurrentUser();

    expect(apiClient.get).toHaveBeenCalledWith("/auth/me");
  });

  test("logoutUser calls logout endpoint", async () => {
    apiClient.post.mockResolvedValue({
      data: {
        success: true,
      },
    });

    await logoutUser();

    expect(apiClient.post).toHaveBeenCalledWith("/auth/logout");
  });

  test("forgotPassword sends email", async () => {
    const data = {
      email: "rabea@example.com",
    };

    apiClient.post.mockResolvedValue({
      data: {
        success: true,
      },
    });

    await forgotPassword(data);

    expect(apiClient.post).toHaveBeenCalledWith("/auth/forgot-password", data);
  });

  test("resetPassword sends reset data", async () => {
    const data = {
      token: "reset-token",
      password: "NewPassword@123",
      confirmPassword: "NewPassword@123",
    };

    apiClient.post.mockResolvedValue({
      data: {
        success: true,
      },
    });

    await resetPassword(data);

    expect(apiClient.post).toHaveBeenCalledWith("/auth/reset-password", data);
  });

  test("changePassword sends password data", async () => {
    const data = {
      currentPassword: "Rabea@123",
      newPassword: "NewPassword@123",
      confirmPassword: "NewPassword@123",
    };

    apiClient.post.mockResolvedValue({
      data: {
        success: true,
      },
    });

    await changePassword(data);

    expect(apiClient.post).toHaveBeenCalledWith("/auth/change-password", data);
  });
});

import apiClient from "./apiClient.js";

const registerUser = async (userData) => {
  const response = await apiClient.post("/auth/register", userData);

  return response.data;
};

const verifyEmail = async (data) => {
  const response = await apiClient.post("/auth/verify-email", data);

  return response.data;
};

const resendVerificationCode = async (data) => {
  const response = await apiClient.post("/auth/resend-verification-code", data);

  return response.data;
};

const loginUser = async (data) => {
  const response = await apiClient.post("/auth/login", data);

  return response.data;
};

const getCurrentUser = async () => {
  const response = await apiClient.get("/auth/me");

  return response.data;
};

const logoutUser = async () => {
  const response = await apiClient.post("/auth/logout");

  return response.data;
};

const forgotPassword = async (data) => {
  const response = await apiClient.post("/auth/forgot-password", data);

  return response.data;
};

const resetPassword = async (data) => {
  const response = await apiClient.post("/auth/reset-password", data);

  return response.data;
};

const changePassword = async (data) => {
  const response = await apiClient.post("/auth/change-password", data);

  return response.data;
};

export {
  registerUser,
  verifyEmail,
  resendVerificationCode,
  loginUser,
  getCurrentUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  changePassword,
};

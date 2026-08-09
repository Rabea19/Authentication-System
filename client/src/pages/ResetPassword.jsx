import { useState } from "react";

import { useNavigate, useSearchParams } from "react-router";

import { resetPassword } from "../api/authApi.js";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!token) {
      setError("Password reset token is missing or invalid.");

      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");

      return;
    }

    try {
      setSubmitting(true);

      await resetPassword({
        token,
        password,
        confirmPassword,
      });

      navigate("/", {
        replace: true,
      });
    } catch (requestError) {
      const validationErrors = requestError?.response?.data?.errors;

      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        setError(validationErrors[0].message);

        return;
      }

      setError(
        requestError?.response?.data?.message ||
          "Unable to reset your password. The link may be invalid or expired.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl text-white shadow-sm">
            🔑
          </div>

          <p className="mt-6 text-sm font-semibold text-blue-600">
            Authentication System
          </p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-9">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900">
              Reset password
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Enter your new password below.
            </p>
          </div>

          {!token && (
            <div
              role="alert"
              className="mt-7 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-600"
            >
              This password reset link is missing its security token.
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="newPassword"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                New Password
              </label>

              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter new password"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm new password"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-600"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !token}
              className="w-full rounded-xl bg-blue-600 px-4 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-7 w-full text-center text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </main>
  );
};

export default ResetPassword;

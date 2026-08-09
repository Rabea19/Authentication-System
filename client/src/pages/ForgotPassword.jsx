import { useState } from "react";

import { useNavigate } from "react-router";

import { forgotPassword } from "../api/authApi.js";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    try {
      setSubmitting(true);

      const response = await forgotPassword({
        email,
      });

      setMessage(
        response.message ||
          "If an account exists for this email, a password reset link has been sent.",
      );
    } catch (requestError) {
      const validationErrors = requestError?.response?.data?.errors;

      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        setError(validationErrors[0].message);

        return;
      }

      setError(
        requestError?.response?.data?.message ||
          "Unable to process your request. Please try again.",
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
            🔒
          </div>

          <p className="mt-6 text-sm font-semibold text-blue-600">
            Authentication System
          </p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-9">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900">
              Forgot password?
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Enter the email address associated with your account and we'll
              send you a password reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
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

            {message && (
              <div
                role="status"
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700"
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-blue-600 px-4 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;

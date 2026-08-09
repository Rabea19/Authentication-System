import { useState } from "react";

import { useLocation, useNavigate } from "react-router";

import { resendVerificationCode, verifyEmail } from "../api/authApi.js";

const VerifyEmail = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const email = location.state?.email || "";

  const [code, setCode] = useState("");

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [resending, setResending] = useState(false);

  const handleCodeChange = (event) => {
    const numbersOnly = event.target.value.replace(/\D/g, "");

    setCode(numbersOnly.slice(0, 6));
  };

  const handleVerify = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!email) {
      setError("Email address is missing. Please register again.");

      return;
    }

    try {
      setSubmitting(true);

      await verifyEmail({
        email,
        code,
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
          "Unable to verify your email. Please check the code and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");

    if (!email) {
      setError("Email address is missing. Please register again.");

      return;
    }

    try {
      setResending(true);

      const response = await resendVerificationCode({
        email,
      });

      setMessage(response.message || "A new verification code has been sent.");
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Unable to resend the verification code.",
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl text-white shadow-sm">
            ✉
          </div>

          <p className="mt-6 text-sm font-semibold text-blue-600">
            Authentication System
          </p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-9">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900">
              Verify your email
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              We sent a 6-digit verification code to
            </p>

            {email ? (
              <p className="mt-1 break-all font-semibold text-slate-900">
                {email}
              </p>
            ) : (
              <p className="mt-1 font-semibold text-red-500">
                Email unavailable
              </p>
            )}
          </div>

          <form onSubmit={handleVerify} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="verificationCode"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Verification Code
              </label>

              <input
                id="verificationCode"
                name="verificationCode"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={handleCodeChange}
                placeholder="123456"
                maxLength={6}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-xl font-semibold tracking-[0.35em] text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
              disabled={submitting || code.length !== 6}
              className="w-full rounded-xl bg-blue-600 px-4 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <div className="mt-7 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-500">Didn't receive the code?</p>

            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="mt-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resending ? "Sending..." : "Resend Code"}
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 w-full text-center text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </main>
  );
};

export default VerifyEmail;

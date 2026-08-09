import { useState } from "react";

import { useNavigate } from "react-router";

import { useAuth } from "../context/AuthContext.jsx";

const Home = () => {
  const navigate = useNavigate();

  const { login, register } = useAuth();

  const [authMode, setAuthMode] = useState("login");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [name, setName] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const resetMessages = () => {
    setError("");
  };

  const handleModeChange = (mode) => {
    setAuthMode(mode);
    resetMessages();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    resetMessages();

    try {
      setSubmitting(true);

      if (authMode === "login") {
        await login({
          email,
          password,
        });

        navigate("/dashboard");

        return;
      }

      await register({
        name,
        email,
        password,
        confirmPassword,
      });

      navigate("/verify-email", {
        state: {
          email,
        },
      });
    } catch (requestError) {
      const validationErrors = requestError?.response?.data?.errors;

      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        setError(validationErrors[0].message);

        return;
      }

      const errorMessage =
        requestError?.response?.data?.message ||
        (authMode === "login"
          ? "Unable to login. Please check your email and password."
          : "Unable to create your account. Please check your details.");

      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:px-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white shadow-sm">
              A
            </div>

            <div>
              <p className="text-lg font-bold text-slate-900">Auth System</p>

              <p className="text-xs text-slate-500">Secure Authentication</p>
            </div>
          </div>

          <p className="hidden text-sm text-slate-500 sm:block">
            Simple. Secure. Reliable.
          </p>
        </header>

        <section className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[2fr_1fr] lg:gap-16">
          {/* LEFT SIDE */}
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              Modern Authentication Experience
            </div>

            <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Welcome to your secure digital space.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              A clean and secure authentication system designed to make account
              access simple, safe, and comfortable.
            </p>

            <div className="mt-10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                About
              </p>

              <h2 className="mt-3 text-2xl font-bold text-slate-900">
                Everything you need to access your account securely.
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-slate-600">
                Create your account, verify your email, sign in securely,
                recover your password, and manage your account from one simple
                experience.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  ✓
                </div>

                <h3 className="font-semibold text-slate-900">Secure Login</h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Protected authentication and secure sessions.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  ✉
                </div>

                <h3 className="font-semibold text-slate-900">
                  Email Verification
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Verify your account before accessing protected features.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  🔒
                </div>

                <h3 className="font-semibold text-slate-900">
                  Account Protection
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Password recovery and account security tools.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-full">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
              <div className="mb-8">
                <p className="text-sm font-medium text-blue-600">
                  {authMode === "login" ? "Welcome back" : "Get started"}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {authMode === "login" ? "Sign in" : "Create account"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {authMode === "login"
                    ? "Enter your details to access your account."
                    : "Create your account to get started."}
                </p>
              </div>

              <div className="mb-7 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => handleModeChange("login")}
                  className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                    authMode === "login"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() => handleModeChange("signup")}
                  className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                    authMode === "signup"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {authMode === "signup" && (
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Full Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Enter your name"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                )}

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

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-slate-700"
                    >
                      Password
                    </label>

                    {authMode === "login" && (
                      <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    required
                    minLength={8}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {authMode === "signup" && (
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
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      placeholder="Confirm your password"
                      required
                      minLength={8}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                )}

                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-blue-600 px-4 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Please wait..."
                    : authMode === "login"
                      ? "Login"
                      : "Create Account"}
                </button>
              </form>

              <p className="mt-6 text-center text-xs leading-5 text-slate-400">
                Your account information is protected and securely handled.
              </p>
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-400">
          Authentication System
        </footer>
      </div>
    </main>
  );
};

export default Home;

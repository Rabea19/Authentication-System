import { useState } from "react";

import { useNavigate } from "react-router";

import { useAuth } from "../context/AuthContext.jsx";

const stack = [
  "React",
  "Vite",
  "Tailwind CSS",
  "Node.js",
  "Express",
  "MongoDB",
];

const highlights = [
  "JWT Authentication",
  "HttpOnly Cookies",
  "Email Verification",
  "Password Recovery",
  "Protected Routes",
  "CSRF & Rate Limiting",
];

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
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-7 lg:px-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[620px] overflow-hidden">
          <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-cyan-400/5 blur-3xl" />
        </div>

        <header className="relative z-10 flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-500/10 text-base font-black text-blue-300">
              A
            </div>

            <div>
              <p className="font-semibold tracking-tight text-white">
                Auth System
              </p>
              <p className="text-xs text-slate-500">Portfolio Project</p>
            </div>
          </div>

          <a
            href="https://github.com/Rabea19/Authentication-System"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-4 w-4 fill-current"
            >
              <path d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2.23c-3.24.7-3.92-1.38-3.92-1.38-.53-1.35-1.3-1.71-1.3-1.71-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.76.4-1.27.74-1.56-2.59-.3-5.31-1.3-5.31-5.73 0-1.27.45-2.3 1.2-3.12-.12-.3-.52-1.48.11-3.08 0 0 .98-.31 3.16 1.19A11 11 0 0 1 12 6c.98 0 1.96.13 2.88.39 2.19-1.5 3.17-1.19 3.17-1.19.63 1.6.23 2.78.11 3.08.75.82 1.2 1.85 1.2 3.12 0 4.45-2.73 5.43-5.32 5.72.42.36.79 1.07.79 2.16v3.27c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .7Z" />
            </svg>
            GitHub
            <span className="transition group-hover:translate-x-0.5">↗</span>
          </a>
        </header>

        <section className="relative z-10 grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1.35fr_0.85fr] lg:gap-16 xl:gap-20">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3.5 py-1.5 text-xs font-bold tracking-[0.16em] text-blue-300">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-300" />
              FULL-STACK PORTFOLIO PROJECT
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              Authentication System
            </h1>

            <p className="mt-4 text-lg font-semibold text-blue-300 sm:text-xl">
              Secure Full-Stack Authentication Application
            </p>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
              A portfolio project built to demonstrate secure user
              authentication, email verification, password recovery, protected
              routes, and modern web security practices across a complete
              frontend and backend workflow.
            </p>

            <div
              className="mt-7 flex flex-wrap gap-2.5"
              aria-label="Tech stack"
            >
              {stack.map((technology) => (
                <span
                  key={technology}
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm font-medium text-slate-300"
                >
                  {technology}
                </span>
              ))}
            </div>

            <div className="mt-9">
              <div className="mb-4 flex items-center gap-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  Project highlights
                </p>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3.5"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        aria-hidden="true"
                        className="h-3.5 w-3.5"
                      >
                        <path
                          d="m5 10 3 3 7-7"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <span className="text-sm font-medium text-slate-300">
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="https://github.com/Rabea19/Authentication-System"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-200"
              >
                View Source Code
                <span>↗</span>
              </a>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                Live authentication demo available here
                <span className="hidden text-slate-600 sm:inline">→</span>
              </div>
            </div>
          </div>

          <div className="w-full lg:justify-self-end">
            <div className="mx-auto w-full max-w-md rounded-[26px] border border-white/10 bg-white p-6 text-slate-900 shadow-2xl shadow-black/30 sm:p-8">
              <div className="mb-7 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                    Interactive demo
                  </p>

                  <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                    {authMode === "login" ? "Welcome back" : "Create account"}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {authMode === "login"
                      ? "Sign in to test the protected authentication flow."
                      : "Register a new account and test email verification."}
                  </p>
                </div>

                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className="h-5 w-5"
                  >
                    <path
                      d="M7 10V8a5 5 0 0 1 10 0v2m-9 0h8a2 2 0 0 1 2 2v7H6v-7a2 2 0 0 1 2-2Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
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

              <div className="mt-6 flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-400">
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                >
                  <path
                    d="M6.5 8V6.5a3.5 3.5 0 1 1 7 0V8m-6 0h5a1.5 1.5 0 0 1 1.5 1.5V15H6V9.5A1.5 1.5 0 0 1 7.5 8Z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Secure cookie-based authentication
              </div>
            </div>
          </div>
        </section>

        <footer className="relative z-10 flex flex-col gap-2 border-t border-white/10 py-5 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>Authentication System · Full-Stack Portfolio Project</p>
          <p>React · Node.js · Express · MongoDB</p>
        </footer>
      </div>
    </main>
  );
};

export default Home;

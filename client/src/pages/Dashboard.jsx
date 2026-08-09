import { useState } from "react";

import { useNavigate } from "react-router";

import { useAuth } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [error, setError] = useState("");

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setError("");

    try {
      setLoggingOut(true);

      await logout();

      navigate("/", {
        replace: true,
      });
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Unable to logout. Please try again.",
      );
    } finally {
      setLoggingOut(false);
    }
  };

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <header className="flex items-center justify-between border-b border-slate-200 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white shadow-sm">
              A
            </div>

            <div>
              <p className="text-lg font-bold text-slate-900">Auth System</p>

              <p className="text-xs text-slate-500">Dashboard</p>
            </div>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">
                {user?.name}
              </p>

              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 font-semibold text-blue-600">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <section className="py-10">
          <div className="mb-10">
            <p className="mb-2 text-sm font-semibold text-blue-600">
              Dashboard
            </p>

            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Welcome, {user?.name}
            </h1>

            <p className="mt-3 text-slate-500">
              Manage your account and security settings from one place.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
              <div className="mb-6">
                <p className="text-sm font-semibold text-blue-600">
                  Account Information
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Your profile
                </h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Full Name</p>

                  <p className="mt-2 font-semibold text-slate-900">
                    {user?.name}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Email</p>

                  <p className="mt-2 break-all font-semibold text-slate-900">
                    {user?.email}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Role</p>

                  <p className="mt-2 font-semibold capitalize text-slate-900">
                    {user?.role}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Email Status</p>

                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        user?.isVerified ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />

                    <p className="font-semibold text-slate-900">
                      {user?.isVerified ? "Verified" : "Not Verified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-blue-600">Security</p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Account Security
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Update your password or securely sign out of your account.
              </p>

              {error && (
                <div
                  role="alert"
                  className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-600"
                >
                  {error}
                </div>
              )}

              <div className="mt-8 space-y-3">
                <button
                  type="button"
                  onClick={handleChangePassword}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Change Password
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;

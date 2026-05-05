"use client";

import { useState } from "react";
import API from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.post("/auth/login", form);
      login(res.data.data.token);
      router.push("/dashboard");
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen flex">
    <div className="w-full flex">

      {/* Left Panel - expanded to 45% */}
      <div className="hidden md:flex flex-col justify-between bg-[#0a0a0a] p-14 w-[45%] relative overflow-hidden">
        {/* Subtle circle accents */}
        <div className="absolute top-[-100px] right-[-100px] w-80 h-80 rounded-full bg-white/[0.03]" />
        <div className="absolute bottom-[-80px] left-[-60px] w-72 h-72 rounded-full bg-white/[0.02]" />

        {/* Brand */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM8 13h8v1.5H8V13zm0 3h5v1.5H8V16zm0-6h3v1.5H8V10z" />
            </svg>
          </div>
          <span className="text-white font-semibold text-base tracking-wide">Smart CV</span>
        </div>

        {/* Hero text */}
        <div className="relative z-10">
          <h2 className="text-5xl font-serif italic text-white leading-snug mb-5">
            Land your dream job, faster.
          </h2>
          <p className="text-base text-white/50 leading-relaxed max-w-sm">
            AI-powered CV matching that connects you with the right opportunities instantly.
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-10 relative z-10">
          {[["94%", "Match Rate"], ["12k+", "Job Listings"], ["3.2k", "Hired"]].map(([num, label]) => (
            <div key={label} className="border-t border-white/10 pt-5">
              <div className="text-3xl font-semibold text-white">{num}</div>
              <div className="text-[11px] text-white/40 mt-1 uppercase tracking-widest">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 bg-white px-16 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-sm text-gray-400 mb-10">Sign in to your dashboard</p>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="relative mb-4">
            <input
              type="email"
              id="email"
              placeholder=" "
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="peer w-full bg-gray-50 border border-gray-200 rounded-xl px-4 pt-6 pb-2 text-sm outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 transition-all"
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none transition-all
                peer-focus:top-3.5 peer-focus:text-[10px] peer-focus:text-black peer-focus:font-semibold
                peer-[:not(:placeholder-shown)]:top-3.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-black"
            >
              Email address
            </label>
          </div>

          {/* Password */}
          <div className="relative mb-8">
            <input
              type="password"
              id="password"
              placeholder=" "
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="peer w-full bg-gray-50 border border-gray-200 rounded-xl px-4 pt-6 pb-2 text-sm outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 transition-all"
            />
            <label
              htmlFor="password"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none transition-all
                peer-focus:top-3.5 peer-focus:text-[10px] peer-focus:text-black peer-focus:font-semibold
                peer-[:not(:placeholder-shown)]:top-3.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-black"
            >
              Password
            </label>
          </div>

          {/* Sign in button - BLACK */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-black hover:bg-gray-900 active:scale-[0.98] transition-all text-white font-semibold py-4 rounded-xl text-sm tracking-wide"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="flex items-center gap-3 my-5 text-gray-300 text-xs">
            <div className="flex-1 h-px bg-gray-200" />
            or
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google button */}
          <button className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-4 text-sm text-gray-700 font-medium hover:bg-gray-50 active:scale-[0.98] transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="mt-8 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <span
              onClick={() => router.push("/signup")}
              className="text-black font-semibold cursor-pointer hover:underline"
            >
              Register here
            </span>
          </p>
        </div>
      </div>

    </div>
  </div>
);
}
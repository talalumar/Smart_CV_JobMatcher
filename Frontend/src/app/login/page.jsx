"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/services/supabase";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const router = useRouter();

  /*
  ========================================
  Email/Password Login
  ========================================
  */
  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });

      if (error) throw error;

      const token = data.session.access_token;

      // ✅ Save token for backend APIs
      localStorage.setItem("token", token);

      // ✅ Save in context (if you use it)
      login(token);

      router.push("/dashboard");
    } catch (err) {
      console.log(err);
      setError(
        err.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  ========================================
  Google Login
  ========================================
  */
  const handleGoogleLogin = async () => {
  try {
    const { error } =
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo:
            "http://localhost:3000/auth/callback",
        },
      });

    if (error) {
      console.log(error);
      alert("Google login failed");
    }
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="min-h-screen flex">
      <div className="w-full flex">

        {/* Left Panel */}
        <div className="hidden md:flex flex-col justify-between bg-[#0a0a0a] p-14 w-[45%] relative overflow-hidden">
          <div className="absolute top-[-100px] right-[-100px] w-80 h-80 rounded-full bg-white/[0.03]" />
          <div className="absolute bottom-[-80px] left-[-60px] w-72 h-72 rounded-full bg-white/[0.02]" />

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM8 13h8v1.5H8V13zm0 3h5v1.5H8V16zm0-6h3v1.5H8V10z" />
              </svg>
            </div>
            <span className="text-white font-semibold text-base tracking-wide">
              Smart CV
            </span>
          </div>

          <div className="relative z-10">
            <h2 className="text-5xl font-serif italic text-white leading-snug mb-5">
              Land your dream job, faster.
            </h2>
            <p className="text-base text-white/50 leading-relaxed max-w-sm">
              AI-powered CV matching that connects you with the right opportunities instantly.
            </p>
          </div>

          <div className="flex gap-10 relative z-10">
            {[
              ["94%", "Match Rate"],
              ["12k+", "Job Listings"],
              ["3.2k", "Hired"],
            ].map(([num, label]) => (
              <div key={label} className="border-t border-white/10 pt-5">
                <div className="text-3xl font-semibold text-white">{num}</div>
                <div className="text-[11px] text-white/40 mt-1 uppercase tracking-widest">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 bg-white px-16 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h1>
            <p className="text-sm text-gray-400 mb-10">
              Sign in to your dashboard
            </p>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="relative mb-4">
              <input
                type="email"
                placeholder=" "
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="peer w-full bg-gray-50 border border-gray-200 rounded-xl px-4 pt-6 pb-2 text-sm outline-none focus:ring-2 focus:ring-black text-gray-900"
              />
              <label className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 transition-all
                peer-focus:top-3.5 peer-focus:text-[10px] peer-focus:text-black
                peer-[:not(:placeholder-shown)]:top-3.5 peer-[:not(:placeholder-shown)]:text-[10px]">
                Email address
              </label>
            </div>

            {/* Password */}
            <div className="relative mb-8">
              <input
                type="password"
                placeholder=" "
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                className="peer w-full bg-gray-50 border border-gray-200 rounded-xl px-4 pt-6 pb-2 text-sm outline-none focus:ring-2 focus:ring-black text-gray-900"
              />
              <label className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 transition-all
                peer-focus:top-3.5 peer-focus:text-[10px] peer-focus:text-black
                peer-[:not(:placeholder-shown)]:top-3.5 peer-[:not(:placeholder-shown)]:text-[10px]">
                Password
              </label>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-xl font-semibold"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <div className="flex items-center gap-3 my-5 text-gray-300 text-xs">
              <div className="flex-1 h-px bg-gray-200" />
              or
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google */}
            <button
              onClick={handleGoogleLogin}
              className="w-full border rounded-xl py-4 text-sm cursor-pointer"
            >
              Continue with Google
            </button>

            <p className="mt-8 text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <span
                onClick={() => router.push("/signup")}
                className="text-black font-semibold cursor-pointer"
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
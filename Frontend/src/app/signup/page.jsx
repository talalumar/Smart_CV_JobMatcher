"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const router = useRouter();

  const handleSignup = async () => {
    try {
      setLoading(true);
      setError("");

      /*
      ===============================
      SUPABASE SIGNUP
      ===============================
      */

      const { data, error } =
        await supabase.auth.signUp({
          email: form.email,
          password: form.password,

          options: {
            data: {
              name: form.name,
            },
          },
        });

      /*
      ===============================
      HANDLE ERRORS
      ===============================
      */

      if (error) {
        throw error;
      }

      /*
      ===============================
      EMAIL ALREADY EXISTS
      ===============================
      */

      if (
        data?.user &&
        data?.user?.identities
          ?.length === 0
      ) {
        setError(
          "Account already exists with this email"
        );

        return;
      }

      /*
      ===============================
      SUCCESS
      ===============================
      */

      alert(
        "Signup successful! Please check your email to verify your account."
      );

      router.push("/login");
    } catch (err) {
      console.log(err);

      setError(
        err.message ||
          "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
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
              <svg
                className="w-5 h-5 fill-white"
                viewBox="0 0 24 24"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM8 13h8v1.5H8V13zm0 3h5v1.5H8V16zm0-6h3v1.5H8V10z" />
              </svg>
            </div>

            <span className="text-white font-semibold text-base tracking-wide">
              Smart CV
            </span>
          </div>

          <div className="relative z-10">
            <h2 className="text-5xl font-serif italic text-white leading-snug mb-5">
              Your career journey starts
              here.
            </h2>

            <p className="text-base text-white/50 leading-relaxed max-w-sm">
              Create your profile and let
              AI match you with the best
              opportunities.
            </p>
          </div>

          <div className="flex gap-10 relative z-10">
            {[
              ["2min", "To Sign Up"],
              ["AI", "Powered"],
              ["Free", "To Start"],
            ].map(([num, label]) => (
              <div
                key={label}
                className="border-t border-white/10 pt-5"
              >
                <div className="text-3xl font-semibold text-white">
                  {num}
                </div>

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
              Create account
            </h1>

            <p className="text-sm text-gray-400 mb-10">
              Join Smart CV Job Matcher
            </p>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Name */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder=" "
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name:
                      e.target.value,
                  })
                }
                className="peer w-full bg-gray-50 border border-gray-200 rounded-xl px-4 pt-6 pb-2 text-sm outline-none focus:ring-2 focus:ring-black"
              />

              <label className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 transition-all
                peer-focus:top-3.5 peer-focus:text-[10px]
                peer-[:not(:placeholder-shown)]:top-3.5 peer-[:not(:placeholder-shown)]:text-[10px]">
                Full name
              </label>
            </div>

            {/* Email */}
            <div className="relative mb-4">
              <input
                type="email"
                placeholder=" "
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email:
                      e.target.value,
                  })
                }
                className="peer w-full bg-gray-50 border border-gray-200 rounded-xl px-4 pt-6 pb-2 text-sm outline-none focus:ring-2 focus:ring-black"
              />

              <label className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 transition-all
                peer-focus:top-3.5 peer-focus:text-[10px]
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
                    password:
                      e.target.value,
                  })
                }
                className="peer w-full bg-gray-50 border border-gray-200 rounded-xl px-4 pt-6 pb-2 text-sm outline-none focus:ring-2 focus:ring-black"
              />

              <label className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 transition-all
                peer-focus:top-3.5 peer-focus:text-[10px]
                peer-[:not(:placeholder-shown)]:top-3.5 peer-[:not(:placeholder-shown)]:text-[10px]">
                Password
              </label>
            </div>

            {/* Button */}
            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-xl font-semibold"
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>

            <p className="mt-8 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <span
                onClick={() =>
                  router.push(
                    "/login"
                  )
                }
                className="text-black font-semibold cursor-pointer hover:underline"
              >
                Sign in
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
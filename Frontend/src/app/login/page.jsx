"use client";

import {
  useState,
} from "react";
import API from "@/services/api";
import {
  useAuth,
} from "@/context/AuthContext";
import {
  useRouter,
} from "next/navigation";

export default function Login() {
  const [form, setForm] =
    useState({
      email: "",
      password: "",
    });

  const { login } =
    useAuth();

  const router =
    useRouter();

  const handleLogin =
    async () => {
      try {
        const res =
          await API.post(
            "/auth/login",
            form
          );

        login(
          res.data.token
        );

        router.push(
          "/dashboard"
        );
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <div>
      <h1>Login</h1>

      <input
        placeholder="Email"
        onChange={(e) =>
          setForm({
            ...form,
            email:
              e.target.value,
          })
        }
      />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) =>
          setForm({
            ...form,
            password:
              e.target.value,
          })
        }
      />

      <button
        onClick={
          handleLogin
        }
      >
        Login
      </button>
    </div>
  );
}
"use client";

import {
  useState,
} from "react";
import API from "@/services/api";

export default function Signup() {
  const [form, setForm] =
    useState({
      name: "",
      email: "",
      password: "",
    });

  const handleSignup =
    async () => {
      try {
        await API.post(
          "/auth/signup",
          form
        );

        alert(
          "Signup Successful"
        );
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <div>
      <h1>Signup</h1>

      <input
        placeholder="Name"
        onChange={(e) =>
          setForm({
            ...form,
            name: e.target.value,
          })
        }
      />

      <input
        placeholder="Email"
        onChange={(e) =>
          setForm({
            ...form,
            email: e.target.value,
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
          handleSignup
        }
      >
        Signup
      </button>
    </div>
  );
}
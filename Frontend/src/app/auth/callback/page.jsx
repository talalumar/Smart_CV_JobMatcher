"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        localStorage.setItem(
          "token",
          session.access_token
        );

        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    };

    getSession();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Loading...
    </div>
  );
}
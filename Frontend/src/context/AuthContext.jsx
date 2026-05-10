"use client";

import { createContext, useContext, useEffect, useState } from "react";
import supabase from "@/services/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
  ========================================
  Get Initial Session
  ========================================
  */
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setUser(session?.user || null);

      if (session?.access_token) {
        localStorage.setItem(
          "token",
          session.access_token
        );
      }

      setLoading(false);
    };

    getSession();

    /*
    ========================================
    Listen Auth Changes
    ========================================
    */
    const { data: listener } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
          setUser(session?.user || null);

          if (session?.access_token) {
            localStorage.setItem(
              "token",
              session.access_token
            );
          } else {
            localStorage.removeItem("token");
          }
        }
      );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  /*
  ========================================
  AUTH METHODS
  ========================================
  */

  const signup = async (
    email,
    password,
    name
  ) => {
    const { error } =
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

    return { error };
  };

  const login = async (
    email,
    password
  ) => {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    return { data, error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);
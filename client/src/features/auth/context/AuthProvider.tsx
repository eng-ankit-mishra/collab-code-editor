import { useState, useEffect } from "react";
import { supabase } from "../../../supabase-client.ts";
import { AuthContext } from "./AuthContext.tsx";
import type { Session } from "@supabase/supabase-js";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  /* ---------- INITIAL SESSION ---------- */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);

      if (session?.user) {
        createUserIfNotExists(session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /* ---------- CREATE USER (BACKEND) ---------- */
  async function createUserIfNotExists(session: Session) {
    try {
      await fetch(
        "https://codevspace-aqhw.onrender.com/api/users/create-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            userId: session.user.id,
            userName:
              session.user.user_metadata.full_name ||
              session.user.email,
            userEmail: session.user.email,
          }),
        }
      );
    } catch (err) {
      console.error("Failed to sync user:", err);
    }
  }

  /* ---------- AUTH ACTIONS ---------- */

  const signInUser = async (email: string, password: string) => {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  };

  const signUpUser = async (
    name: string,
    email: string,
    password: string
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
      options: {
        data: { full_name: name },
      },
    });

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  };

  const signOutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  /* ---------- OAUTH ---------- */

  const signInWithGoogle = async (): Promise<void> => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  const signInWithGithub = async (): Promise<void> => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  /* ---------- PASSWORD ---------- */

  const resetPassword = async (email: string) => {
    const { error } =
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/change-password`,
      });

    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const updateUser = async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password,
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  /* ---------- DELETE ACCOUNT (BACKEND + ADMIN) ---------- */
  const deleteAccount = async (accessToken: string) => {
    try {
      const res = await fetch(
        "https://codevspace-aqhw.onrender.com/api/users/delete-account",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!res.ok) {
        const data = await res.json();
        return {
          success: false,
          error: data.error || "Failed to delete account",
        };
      }

      return { success: true };
    } catch (err) {
      console.error("Delete account failed:", err);
      return {
        success: false,
        error: "Server error while deleting account",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        signInUser,
        signOutUser,
        signUpUser,
        signInWithGoogle,
        signInWithGithub,
        resetPassword,
        updateUser,
        deleteAccount, // ✅ NOW EXPOSED
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

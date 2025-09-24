"use client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    const { data: listener } = supabaseBrowser.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          // redirect to home after login
          router.push("/");
        }
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md border rounded p-6 bg-white text-black">
        <h1 className="text-2xl font-bold mb-4">Sign in to CineRate 🎬</h1>
        <Auth
          supabaseClient={supabaseBrowser}
          appearance={{ theme: ThemeSupa }}
          providers={["google"]}
        />
      </div>
    </div>
  );
}

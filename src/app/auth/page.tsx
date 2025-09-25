"use client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Clapperboard } from "lucide-react";

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
      <div className="w-full max-w-md border rounded p-6 bg-[#1e1e1e] text-white">
  <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">Sign in to CineRate <Clapperboard size={20} /></h1>
        <Auth
          supabaseClient={supabaseBrowser}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#7c3aed',
                  brandAccent: '#06b6d4',
                },
              },
            },
            style:{
              button: {
                background: "linear-gradient(180deg, rgba(124,58,237,0.16), rgba(124,58,237,0.08))",
                borderColor: "rgba(124,58,237,0.35)",
                color: "white", 
               }
            }
           }}
          theme="dark"
          providers={["google"]}
        />
      </div>
    </div>
  );
}

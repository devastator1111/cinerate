"use client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabaseBrowser } from "../lib/supabaseClient";

export default function SupabaseAuth() {
  return (
    <div className="container p-6">
      <div className="card max-w-md mx-auto">
        <h2 className="text-lg font-bold mb-3">Sign in to CineRate</h2>
        <Auth
          supabaseClient={supabaseBrowser}
          appearance={{ theme: ThemeSupa }}
          providers={["google"]}
        />
      </div>
    </div>
  );
}

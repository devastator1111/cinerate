"use client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabaseBrowser } from "../lib/supabaseClient";

export default function SupabaseAuth() {
  return (
    <div className="max-w-md mx-auto p-4">
      <Auth
        supabaseClient={supabaseBrowser}
        appearance={{ theme: ThemeSupa }}
        providers={["google"]}
      />
    </div>
  );
}

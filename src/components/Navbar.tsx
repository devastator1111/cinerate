"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function Navbar() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(({ data }) => setSession(data.session));
    supabaseBrowser.auth.onAuthStateChange((_e, s) => setSession(s ?? null));
  }, []);

  async function signOut() {
    await supabaseBrowser.auth.signOut();
    setSession(null);
  }

  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b bg-black text-white">
      <Link href="/" className="text-xl font-bold">
        CineRate 🎬
      </Link>
      <div className="flex items-center gap-4">
        {session ? (
          <>
            <span className="text-sm">
              Signed in as <b>{session.user.email}</b>
            </span>
            <button
              onClick={signOut}
              className="px-3 py-1 border rounded hover:bg-gray-800"
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link
            href="/auth"
            className="px-3 py-1 border rounded hover:bg-gray-800"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

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
    <nav className="flex items-center justify-between px-6 py-4 border-b" style={{background: 'linear-gradient(90deg, rgba(255,255,255,0.02), transparent)'}}>
      <Link href="/" className="text-xl font-bold">
        CineRate <span className="muted">🎬</span>
      </Link>
      <div className="flex items-center gap-4">
        {session ? (
          <>
            <span className="text-sm muted">
              Signed in as <b className="text-sm">{session.user.email}</b>
            </span>
            <Link href="/movies/add" className="px-3 py-1 border rounded hover:bg-gray-800">
              Add Movie
            </Link>
            <button onClick={signOut} className="btn btn-ghost">
              Sign Out
            </button>
          </>
        ) : (
          <Link href="/auth" className="btn btn-primary">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

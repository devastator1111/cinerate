"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { LogOut, PlusCircle, Clapperboard, Star } from "lucide-react"; // 👈 icons

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
    <nav
      className="flex items-center justify-between px-6 py-4 border-b"
      style={{
        background: "linear-gradient(90deg, rgba(255,255,255,0.02), transparent)",
      }}
    >
      <Link href="/" className="text-xl font-bold flex items-center gap-2">
  CineRate <Clapperboard size={24} className="text-current muted" />
      </Link>
      <div className="flex items-center gap-4">
        {session ? (
          <>
            <span className="text-sm muted">
              Signed in as <b className="text-sm">{session.user.email}</b>
            </span>
            {/* Favourites (icon) */}
              <Link
                  href="/favourites"
                  className="p-2 rounded hover:bg-gray-800"
                  title="Favourites"
                >
                  <Star size={18} className="text-yellow-400" />
               </Link>

            {/* Add Movie (icon) */}
            <Link
              href="/movies/add"
              className="p-2 rounded hover:bg-gray-800"
              title="Add Movie"
            >
              <PlusCircle size={22} />
            </Link>

            {/* Sign Out (icon) */}
            <button
              onClick={signOut}
              className="p-2 rounded hover:bg-gray-800"
              title="Sign Out"
            >
              <LogOut size={22} />
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

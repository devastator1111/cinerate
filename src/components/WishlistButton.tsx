"use client";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function WishlistButton({ movieId }: { movieId: number }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isWish, setIsWish] = useState(false);

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(({ data }) => setSession(data.session ?? null));
    const { data: listener } = supabaseBrowser.auth.onAuthStateChange((_event, s) =>
      setSession(s ?? null)
    );
    return () => listener?.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    (async () => {
      const { data } = await supabaseBrowser
        .from("wishlist")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("movie_id", movieId);
      setIsWish((data ?? []).length > 0);
    })();
  }, [session, movieId]);

  async function toggle() {
    if (!session) {
      window.location.href = "/auth";
      return;
    }

    if (isWish) {
      await supabaseBrowser
        .from("wishlist")
        .delete()
        .eq("user_id", session.user.id)
        .eq("movie_id", movieId);
      setIsWish(false);
    } else {
      await supabaseBrowser
        .from("wishlist")
        .insert({ user_id: session.user.id, movie_id: movieId });
      setIsWish(true);
    }
  }

  return (
    <button onClick={toggle} className={`btn ${isWish ? "btn-primary" : "btn-ghost"} border border-gray-600/40`}>
      {isWish ? "✓ Wishlisted" : "+ Add to Wishlist"}
    </button>
  );
}

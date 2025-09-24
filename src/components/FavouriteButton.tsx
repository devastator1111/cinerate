"use client";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function FavouriteButton({ movieId }: { movieId: number }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isFav, setIsFav] = useState(false);

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
        .from("favourite")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("movie_id", movieId);
      setIsFav((data ?? []).length > 0);
    })();
  }, [session, movieId]);

  async function toggle() {
    if (!session) {
      window.location.href = "/auth";
      return;
    }

    if (isFav) {
      await supabaseBrowser
        .from("favourite")
        .delete()
        .eq("user_id", session.user.id)
        .eq("movie_id", movieId);
      setIsFav(false);
    } else {
      await supabaseBrowser
        .from("favourite")
        .insert({ user_id: session.user.id, movie_id: movieId });
      setIsFav(true);
    }
  }

  return (
    <button onClick={toggle} className={`btn ${isFav ? "btn-primary" : "btn-ghost"}`}>
      {isFav ? "♥ Favorited" : "♡ Add to Favourites"}
    </button>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import buildPosterSrc from "@/lib/buildPosterSrc";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { Star } from "lucide-react";

type Movie = { name?: string | null; year?: number | null; poster_url?: string | null };
type WishlistRow = { movie_id: number; movies?: Movie | Movie[] | null };

export default function WishlistPage() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [items, setItems] = useState<WishlistRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const { data } = await supabaseBrowser.auth.getSession();
        const session = data.session;
        if (!session) {
          if (mounted) setUserId(null);
          return;
        }
        if (mounted) setUserId(session.user.id);

        const { data: wishData, error } = await supabaseBrowser
          .from("wishlist")
          .select("movie_id, movies(name, year, poster_url)")
          .eq("user_id", session.user.id);

        if (error) {
          if (mounted) setError(error.message);
        } else {
          if (mounted) setItems(wishData as WishlistRow[]);
        }
      } catch (err: unknown) {
        const message = err && typeof err === "object" && "message" in err ? (err as Record<string, unknown>)['message'] : String(err);
        const msgStr = typeof message === 'string' ? message : String(message);
        if (mounted) setError(msgStr);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    const { data: listener } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      if (session) load();
      else {
        setUserId(null);
        setItems(null);
      }
    });

    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  if (!userId) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold">Please sign in to view wishlist</h2>
        <Link href="/auth" className="underline text-blue-400">
          Go to Login
        </Link>
      </div>
    );
  }

  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Star size={18} className="text-yellow-400"/> My Wishlist
        <span className="ml-2 text-md muted">{items ? items.length : 0}</span>
      </h1>
      {items && items.length ? (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {items.map((f) => {
            const movie = Array.isArray(f.movies) ? f.movies[0] : f.movies;
            return (
              <Link key={f.movie_id} href={`/movies/${f.movie_id}`} className="p-4 border rounded hover:shadow flex gap-4 items-center">
                <Image src={buildPosterSrc(movie?.poster_url)} alt={movie?.name ?? ""} width={80} height={112} className="object-cover rounded" />
                <div>
                  <h2 className="text-lg font-semibold">{movie?.name} ({movie?.year ?? "—"})</h2>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <p>No wishlist items yet. Add some movies <Star size={14} className="text-yellow-400"/></p>
      )}
    </main>
  );
}

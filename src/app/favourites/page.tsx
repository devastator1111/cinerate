"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { supabaseBrowser } from "@/lib/supabaseClient";

type Movie = { name?: string | null; year?: number | null; poster_url?: string | null };
type FavouriteRow = { movie_id: number; movies?: Movie | Movie[] | null };

export default function FavouritesPage() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [favs, setFavs] = useState<FavouriteRow[] | null>(null);
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

        const { data: favData, error } = await supabaseBrowser
          .from("favourite")
          .select("movie_id, movies(name, year, poster_url)")
          .eq("user_id", session.user.id);

        if (error) {
          if (mounted) setError(error.message);
        } else {
          if (mounted) setFavs(favData as FavouriteRow[]);
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
      // reload when auth changes
      if (session) {
        load();
      } else {
        setUserId(null);
        setFavs(null);
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
        <h2 className="text-xl font-bold">Please sign in to view favourites</h2>
        <Link href="/auth" className="underline text-blue-400">
          Go to Login
        </Link>
      </div>
    );
  }

  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <main className="p-6 max-w-4xl mx-auto">
  <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><Star size={18} className="text-yellow-400"/> My Favourites</h1>
      {favs && favs.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favs.map((f) => {
            const movie = Array.isArray(f.movies) ? f.movies[0] : f.movies;
            return (
              <Link key={f.movie_id} href={`/movies/${f.movie_id}`} className="p-4 border rounded hover:shadow flex gap-4 items-center">
                <Image src={movie?.poster_url ?? "/placeholder.png"} alt={movie?.name ?? ""} width={80} height={112} className="object-cover rounded" />
                <div>
                  <h2 className="text-lg font-semibold">{movie?.name} ({movie?.year ?? "—"})</h2>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
  <p>No favourites yet. Add some movies <Star size={14} className="text-yellow-400"/></p>
      )}
    </main>
  );
}
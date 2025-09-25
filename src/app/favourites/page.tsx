import { supabaseServer } from "@/lib/supabaseServer";
import Link from "next/link";
import Image from "next/image";

type FavouriteRow = {
  movie_id: number;
  // Supabase returns an array for related rows unless `single()` is used
  movies?: { name?: string | null; year?: number | null; poster_url?: string | null }[] | null;
};

export default async function FavouritesPage() {
  // Get current user session server-side
  const {
    data: { user },
    error: userError,
  } = await supabaseServer.auth.getUser();

  if (userError || !user) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold">Please sign in to view favourites</h2>
        <Link href="/auth" className="underline text-blue-400">
          Go to Login
        </Link>
      </div>
    );
  }

  // Get all movies in this user’s favourites
  const { data: favs, error } = await supabaseServer
    .from("favourite")
    .select("movie_id, movies(name, year, poster_url)")
    .eq("user_id", user.id);

  if (error) {
    return <div className="p-6 text-red-500">Error: {error.message}</div>;
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">⭐ My Favourites</h1>
      {favs?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favs.map((f: FavouriteRow) => {
            const movie = f.movies?.[0] ?? null;
            return (
              <Link
                key={f.movie_id}
                href={`/movies/${f.movie_id}`}
                className="p-4 border rounded hover:shadow flex gap-4 items-center"
              >
                <Image
                  src={movie?.poster_url || "/placeholder.png"}
                  alt={String(movie?.name ?? "Poster")}
                  width={80}
                  height={112}
                  className="object-cover rounded"
                />
                <div>
                  <h2 className="text-lg font-semibold">
                    {movie?.name ?? "Unknown"} ({movie?.year ?? "—"})
                  </h2>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <p>No favourites yet. Add some movies ⭐</p>
      )}
    </main>
  );
}

import Image from "next/image";
import { Star } from "lucide-react";
import { supabaseServer } from "@/lib/supabaseServer";
import FavouriteButton from "../../../components/FavouriteButton";
import WishlistButton from "../../../components/WishlistButton";
import ReviewForm from "../../../components/ReviewForm";
import buildPosterSrc from "@/lib/buildPosterSrc";

// Reviews in the DB also include a `user_id` (UUID) field — type it explicitly to avoid `any`.
type MovieReview = {
  review_id: number;
  rating: number;
  review_text: string;
  created_at: string;
  user_id?: string | null;
  user_email?: string | null;
  users?: { id: number; username?: string } | null;
};

export default async function MoviePage({ params }: { params: { id: string } }) {
  const id = Number(params.id);

  const { data: movie } = await supabaseServer
    .from("movies")
    .select("*")
    .eq("movie_id", id)
    .single();

  if (!movie) return <div className="p-6">Movie not found</div>;

    const { data: reviews } = await supabaseServer
  .from("reviews")
  .select("review_id, rating, review_text, created_at, user_id, user_email")
  .eq("movie_id", id)
  .order("created_at", { ascending: false });


  return (
    <main className="p-6 max-w-3xl mx-auto">
      <div className="flex gap-6">
          <div className="rounded overflow-hidden border border-gray-600/30">
          <Image
            src={buildPosterSrc(movie.poster_url)}
            alt={movie.name}
            width={144}
            height={208}
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            {movie.name} ({movie.year})
          </h1>
          <p className="mt-2">{movie.description}</p>
          {(movie.language || movie.country) && (
            <p className="mt-2 text-sm muted">
              {movie.language ? <>Language: <strong>{movie.language}</strong></> : null}
              {movie.language && movie.country ? <> &middot; </> : null}
              {movie.country ? <>Country: <strong>{movie.country}</strong></> : null}
            </p>
          )}
          <div className="mt-4 flex gap-3">
            <FavouriteButton movieId={movie.movie_id} />
            <WishlistButton movieId={movie.movie_id} />
          </div>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Write a Review</h2>
        <ReviewForm movieId={movie.movie_id} />
      </section>

      <section className="mt-8">
          <h2 className="text-xl font-semibold">Reviews</h2>
          <div className="mt-4 space-y-4">
            {reviews?.length ? (
              reviews.map((r: MovieReview) => (
                  <div key={r.review_id} className="card border border-gray-600/20">
                  <div className="flex items-start justify-between">
                    <div>
                      <strong>{r.user_email ?? (r.user_id ? String(r.user_id).slice(0, 8) : "Anonymous")}</strong>
                      <div className="muted text-sm">{new Date(r.created_at).toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                        <div className="px-3 py-1 flex items-center gap-2" style={{background: 'linear-gradient(90deg, rgba(124,58,237,0.15), rgba(6,182,212,0.06))', borderRadius: 8}}>
                        <Star size={16} className="text-yellow-400" /> <span className="font-bold">{r.rating}</span>
                      </div>
                    </div>
                  </div>
                  {r.review_text && <p className="mt-3 muted">{r.review_text}</p>}
                </div>
              ))
            ) : (
              <p>No reviews yet</p>
            )}
          </div>
      </section>

    </main>
  );
}

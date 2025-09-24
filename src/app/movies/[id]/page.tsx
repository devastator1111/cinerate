import Image from "next/image";
import { supabaseServer } from "@/lib/supabaseServer";
import FavouriteButton from "../../../components/FavouriteButton";
import ReviewForm from "../../../components/ReviewForm";

type ReviewRow = {
  review_id: number;
  rating: number;
  review_text: string;
  created_at: string;
  users?: { id: number; username?: string } | null;
};

// Reviews in the DB also include a `user_id` (UUID) field — type it explicitly to avoid `any`.
type MovieReview = ReviewRow & { user_id?: string | null };

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
    .select("*")
    .eq("movie_id", id)
    .order("created_at", { ascending: false });


  return (
    <main className="p-6 max-w-3xl mx-auto">
      <div className="flex gap-6">
        <Image
          src={movie.poster_url || "/placeholder.png"}
          alt={movie.name}
          width={144}
          height={208}
          className="object-cover rounded"
        />
        <div>
          <h1 className="text-2xl font-bold">
            {movie.name} ({movie.year})
          </h1>
          <p className="mt-2">{movie.description}</p>
          <div className="mt-4 flex gap-3">
            <FavouriteButton movieId={movie.movie_id} />
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
                <div key={r.review_id} className="p-3 border rounded">
                  <div className="flex justify-between">
                    <strong>{r.user_id}</strong> {/* will show UUID for now */}
                    <span className="text-sm">
                      {new Date(r.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div>⭐ {r.rating}</div>
                  <p className="mt-2">{r.review_text}</p>
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

import Link from "next/link";
import Image from "next/image";
import { supabaseServer } from "@/lib/supabaseServer";

// ensure this page is dynamically rendered in production so new movies appear without a redeploy
export const dynamic = "force-dynamic";

type MovieRatingRow = {
  movie_id: number;
  name: string;
  year?: number | null;
  poster_url?: string | null;
  avg_rating?: number | null;
  review_count?: number | null;
};

export default async function Home() {
  const { data: movies } = await supabaseServer
    .from("movie_ratings")
    .select("*")
    .order("avg_rating", { ascending: false });

  if (!movies) return <div className="p-6">No movies found.</div>;

  const buildPosterSrc = (posterUrl?: string | null) => {
    if (!posterUrl) return "/file.svg";

    // If posterUrl is an absolute URL, try to fix missing TMDB size segment
    if (/^https?:\/\//i.test(posterUrl)) {
      try {
        const url = new URL(posterUrl);
        if (url.hostname === "image.tmdb.org") {
          const parts = url.pathname.split("/").filter(Boolean);
          // Example bad path: /t/p/inception.jpg -> parts = ['t','p','inception.jpg']
          if (parts[0] === "t" && parts[1] === "p" && parts.length === 3) {
            return `https://image.tmdb.org/t/p/w300/${parts[2]}`;
          }
        }
      } catch {
        // fall through to other heuristics
      }
      return posterUrl;
    }

    // posterUrl is a relative path like '/inception.jpg' or '/w300/abc.jpg' or '/t/p/inception.jpg'
    const cleaned = posterUrl.replace(/^\/+/, "");
    const segs = cleaned.split("/");

    // single segment -> likely filename only
    if (segs.length === 1) return `https://image.tmdb.org/t/p/w300/${segs[0]}`;

    // starts with t/p and missing size: 't/p/filename'
    if (segs[0] === "t" && segs[1] === "p" && segs.length === 3) {
      return `https://image.tmdb.org/t/p/w300/${segs[2]}`;
    }

    // already includes size as first segment (e.g. 'w300/abc.jpg' or 'original/abc.jpg')
    if (/^w\d+$/.test(segs[0]) || segs[0] === "original") {
      return `https://image.tmdb.org/t/p/${cleaned}`;
    }

    // default: prefix with tmdb and use default size
    return `https://image.tmdb.org/t/p/w300/${cleaned}`;
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">CineRate 🎬</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {movies.map((m: MovieRatingRow) => (
          <Link
            key={m.movie_id}
            href={`/movies/${m.movie_id}`}
            className="p-4 border rounded hover:shadow"
          >
            <div className="flex gap-4 items-center">
              <Image
                src={buildPosterSrc(m.poster_url)}
                alt={m.name}
                width={80}
                height={112}
                className="object-cover rounded"
              />
              <div>
                <h2 className="text-lg font-semibold">
                  {m.name} ({m.year || "—"})
                </h2>
                <p className="text-sm">
                  ⭐ {m.avg_rating ?? 0} • {m.review_count ?? 0} reviews
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

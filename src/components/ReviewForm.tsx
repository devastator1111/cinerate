"use client";
import { useState, useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function ReviewForm({ movieId }: { movieId: number }) {
  const [rating, setRating] = useState(8.0);
  const [text, setText] = useState("");
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(({ data }) => setSession(data.session));
    supabaseBrowser.auth.onAuthStateChange((_e, s) =>
      setSession(s ?? null)
    );
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) {
  window.location.href = "/auth";
  return;
}


    await supabaseBrowser.from("reviews").insert({
      rating,
      review_text: text,
      user_id: session.user.id,
      movie_id: movieId,
    });
    window.location.reload();
  }

  return (
    <form onSubmit={submit} className="mt-4 p-4 border rounded max-w-md">
      <label className="block">
        Rating (0–10)
        <input
          type="number"
          step="0.1"
          min="0"
          max="10"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="ml-2 border rounded px-2"
        />
      </label>
      <label className="block mt-2">
        Write a review
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full mt-1 border rounded p-2"
        />
      </label>
      <button type="submit" className="mt-3 px-4 py-2 border rounded">
        Submit Review
      </button>
    </form>
  );
}

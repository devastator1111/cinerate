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
    // clamp and snap to 0.5 steps between 1 and 10
    const clamped = Math.min(10, Math.max(1, Math.round(rating * 2) / 2));
    await supabaseBrowser.from("reviews").insert({
      rating: clamped,
      review_text: text,
      user_id: session.user!.id,
      movie_id: movieId,
    });
    window.location.reload();
  }

  return (
    <form onSubmit={submit} className="mt-4 card max-w-md">
      <label className="block">
        <div className="flex items-center justify-between">
          <span>Rating</span>
          <span className="muted text-sm">{rating.toFixed(1)} / 10</span>
        </div>
        <input
          type="number"
          step="0.5"
          min={1}
          max={10}
          value={rating}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (Number.isFinite(v)) setRating(v);
          }}
          className="input mt-2 w-28"
        />
      </label>

      <label className="block mt-4">
        <div className="flex items-center justify-between">
          <span>Write a review</span>
          <span className="muted text-sm">Optional</span>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input mt-2 w-full h-28"
        />
      </label>

      <div className="mt-4 flex gap-3">
        <button type="submit" className="btn btn-primary">
          Submit Review
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setRating(8.0);
            setText("");
          }}
        >
          Reset
        </button>
      </div>
    </form>
  );
}

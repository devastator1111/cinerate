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
      user_email: session.user.email,
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
        <div className="mt-2">
          <div
            className="star-rating"
            role="slider"
            aria-valuemin={1}
            aria-valuemax={10}
            aria-valuenow={rating}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') setRating(prev => Math.max(1, Math.round((prev - 0.5) * 2) / 2));
              if (e.key === 'ArrowRight' || e.key === 'ArrowUp') setRating(prev => Math.min(10, Math.round((prev + 0.5) * 2) / 2));
            }}
          >
            <div className="stars" aria-hidden>
              {Array.from({ length: 10 }).map((_, i) => {
                const value = i + 1; // star value from 1..10
                const full = rating >= value;
                const half = rating >= value - 0.5 && rating < value;
                const fillPercent = full ? 100 : half ? 50 : 0;

                return (
                  <div
                    key={i}
                    className="star"
                    onClick={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      const rect = el.getBoundingClientRect();
                      const clickX = (e.clientX - rect.left) / rect.width; // 0..1
                      const clickedHalf = clickX < 0.5 ? 0.5 : 1;

                      // If current rating is the half value for this star, clicking toggles to full for easy change
                      if (Math.abs(rating - (value - 0.5)) < 0.0001) {
                        setRating(value);
                        return;
                      }

                      let newRating = clickedHalf === 1 ? value : value - 0.5;
                      newRating = Math.min(10, Math.max(1, newRating));
                      setRating(Math.round(newRating * 2) / 2);
                    }}
                    style={{ position: 'relative' }}
                  >
                    {/* empty star */}
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="empty">
                      <path d="M12 .587l3.668 7.431L24 9.748l-6 5.848L19.335 24 12 19.897 4.665 24 6 15.596 0 9.748l8.332-1.73z" />
                    </svg>
                    {/* filled overlay */}
                    <div className="filled-wrap" style={{ width: `${fillPercent}%` }}>
                      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="filled">
                        <path d="M12 .587l3.668 7.431L24 9.748l-6 5.848L19.335 24 12 19.897 4.665 24 6 15.596 0 9.748l8.332-1.73z" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Hidden range input for keyboard/mouse accessibility as backup */}
          <input
            className="sr-only"
            type="range"
            min={1}
            max={10}
            step={0.5}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            aria-label="Rating"
          />
        </div>
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

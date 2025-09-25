"use client";

import { useState, useEffect } from "react";
import { Clapperboard } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function AddMoviePage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);

  const [name, setName] = useState("");
  const [year, setYear] = useState<number | undefined>();
  const [description, setDescription] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [language, setLanguage] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(({ data }) => setSession(data.session));
    supabaseBrowser.auth.onAuthStateChange((_event, s) => {
      setSession(s ?? null);
    });
  }, []);

  if (!session) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold">Please sign in to add a movie</h2>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabaseBrowser.from("movies").insert({
      name,
      year,
      description,
      poster_url: posterUrl,
      language: language || null,
      country: country || null,
    });

    if (error) {
      alert("Error adding movie: " + error.message);
    } else {
      alert("Movie added!");
      router.push("/"); // redirect to home
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6 card">
  <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">Add a Movie <Clapperboard size={26} /></h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input w-full mt-2"
          />
        </div>
        <div>
          <label className="block font-semibold">Year</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="\d*"
            value={year ?? ""}
            onChange={(e) => {
              // keep digits only so user can type freely without spinner buttons
              const digits = e.target.value.replace(/\D/g, "");
              setYear(digits === "" ? undefined : Number(digits));
            }}
            required
            className="input w-full mt-2"
          />
        </div>
        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input w-full mt-2 h-32"
          />
        </div>
        <div>
          <label className="block font-semibold">Poster URL</label>
          <input
            type="url"
            value={posterUrl}
            onChange={(e) => setPosterUrl(e.target.value)}
            className="input w-full mt-2"
          />
        </div>
        <div>
          <label className="block font-semibold">Language</label>
          <input
            type="text"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="input w-full mt-2"
          />
        </div>
        <div>
          <label className="block font-semibold">Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="input w-full mt-2"
          />
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn btn-primary">
            Add Movie
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => router.push('/')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

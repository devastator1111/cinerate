import { createClient } from "@supabase/supabase-js";

// Prefer server-side env vars; fall back to NEXT_PUBLIC ones if present.
const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
	process.env.SUPABASE_SERVICE_ROLE_KEY ??
	process.env.SUPABASE_ANON_KEY ??
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url) {
	throw new Error(
		"Missing Supabase URL. Please set `SUPABASE_URL` (or `NEXT_PUBLIC_SUPABASE_URL`) in your environment."
	);
}
if (!key) {
	throw new Error(
		"Missing Supabase key. Please set `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, or `NEXT_PUBLIC_SUPABASE_ANON_KEY` in your environment."
	);
}

export const supabaseServer = createClient(url, key, {
	// On the server we typically don't persist sessions client-side
	auth: { persistSession: false },
});

// Handle Supabase auth callback and set server cookies so server components
// can read the authenticated session via createServerComponentClient({ cookies }).
// We dynamically import `@supabase/auth-helpers-nextjs` at request time to avoid
// differences in exported shapes across package versions/environments.
import type { NextRequest } from "next/server";

async function runHandler(method: "GET" | "POST", req: NextRequest, ctx: unknown) {
	// Dynamically import the auth helpers at runtime so we pick up the actual
	// exported shape of handleAuth() from the installed package version.
	const mod = await import("@supabase/auth-helpers-nextjs");
		const m = mod as unknown as Record<string, unknown> | undefined;
		const candidate = m?.["handleAuth"] ?? (m?.["default"] && ((m["default"] as Record<string, unknown>)?.["handleAuth"] ?? m["default"]));
		const factory = typeof candidate === "function" ? candidate as (opts?: unknown) => unknown : null;
	if (!factory) throw new Error("Could not resolve handleAuth from @supabase/auth-helpers-nextjs");

	const handler = factory();

	// handler may be a function(req) or an object with GET/POST methods
	if (typeof handler === "function") {
		// handler as function(req)
		return handler(req as unknown as Request);
	}
	const h = handler as Record<string, unknown>;
	const fn = h[method];
	if (typeof fn === "function") {
		const fnTyped = fn as (req: Request, ctx?: unknown) => Promise<Response | void> | Response | void;
		return fnTyped(req as unknown as Request, ctx);
	}
	throw new Error("Unsupported auth handler shape");
}

export async function GET(req: NextRequest, ctx: unknown) {
	return runHandler("GET", req, ctx);
}

export async function POST(req: NextRequest, ctx: unknown) {
	return runHandler("POST", req, ctx);
}

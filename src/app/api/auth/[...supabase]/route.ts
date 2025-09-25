import * as AuthHelpers from "@supabase/auth-helpers-nextjs";

// Handle Supabase auth callback and set server cookies so server components
// can read the authenticated session via createServerComponentClient({ cookies }).
// The `handleAuth()` return type from the package doesn't line up with the
// generated Next route handler types in some package version combinations.
// It's safe to silence the type error here because the function is valid at runtime.
import type { NextRequest } from "next/server";

function resolveHandleAuth() {
	const mod = AuthHelpers as unknown as Record<string, unknown>;
		if (typeof mod["handleAuth"] === "function") return mod["handleAuth"] as (opts?: unknown) => unknown;
	const def = mod["default"] as Record<string, unknown> | undefined;
		if (def && typeof def["handleAuth"] === "function") return def["handleAuth"] as (opts?: unknown) => unknown;
		if (typeof def === "function") return def as unknown as (opts?: unknown) => unknown;
		if (typeof (AuthHelpers as unknown) === "function") return AuthHelpers as unknown as (opts?: unknown) => unknown;
	throw new Error("Could not resolve handleAuth from @supabase/auth-helpers-nextjs");
}

const handlerFactory = resolveHandleAuth();
const handler = handlerFactory();

async function runHandler(method: "GET" | "POST", req: NextRequest, ctx: unknown) {
	// handler may be a function(req) or an object with GET/POST methods
	if (typeof handler === "function") {
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

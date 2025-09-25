// src/lib/supabaseServerClient.ts
import { cookies } from "next/headers";
import * as AuthHelpers from "@supabase/auth-helpers-nextjs";

export function supabaseServerClient() {
  // `createServerComponentClient` exists at runtime; import via namespace to avoid TS export mismatch
  // @ts-expect-error-next-line - namespace import used because the package's typings don't export this symbol directly
  return AuthHelpers.createServerComponentClient({ cookies });
}

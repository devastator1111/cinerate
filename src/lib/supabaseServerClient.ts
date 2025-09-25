import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import type { Database } from "./database.types"; // removed because the file/decl is not present

export function supabaseServerClient() {
  return createServerComponentClient({ cookies });
}

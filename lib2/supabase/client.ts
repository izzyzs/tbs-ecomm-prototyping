import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./database.types.js";
import { SupabaseClient } from "@supabase/supabase-js";


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = () => createBrowserClient<Database>(supabaseUrl!, supabaseKey!);
export type BrowserSupabaseClient = ReturnType<typeof createClient>
export type TypedSupabaseClient = SupabaseClient<Database>

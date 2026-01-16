import { Database } from "./database.types.js";
import { SupabaseClient } from "@supabase/supabase-js";
export declare const createClient: () => import("@supabase/supabase-js/dist/index.cjs").SupabaseClient<Database, "public", "public", any, any>;
export type BrowserSupabaseClient = ReturnType<typeof createClient>;
export type TypedSupabaseClient = SupabaseClient<Database>;
//# sourceMappingURL=client.d.ts.map
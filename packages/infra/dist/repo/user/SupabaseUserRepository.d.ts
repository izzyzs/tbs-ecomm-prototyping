import { UserRepository, Password } from "@tbs/core";
import { Email } from "@tbs/core";
import { BrowserSupabaseClient } from "../../lib/supabase/client.js";
import { User } from "@tbs/core";
export declare class SupabaseUserRepository implements UserRepository {
    private supabase;
    constructor(supabase: BrowserSupabaseClient);
    createAccount(email: Email, password: Password): Promise<User>;
    getUserFromLogin(email: Email, password: Password): Promise<User>;
    getUserFromSession(): Promise<User | null>;
    signOut(): Promise<void>;
}
//# sourceMappingURL=SupabaseUserRepository.d.ts.map
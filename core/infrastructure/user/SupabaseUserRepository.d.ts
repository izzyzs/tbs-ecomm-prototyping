import { UserRepository } from "@/core/domain/user/UserRepository";
import Email from "@/core/domain/user/Email";
import Password from "@/core/domain/user/Password";
import { BrowserSupabaseClient } from "@/lib/supabase/client";
import { User } from "@/core/domain/user/user";
export declare class SupabaseUserRepository implements UserRepository {
    private supabase;
    constructor(supabase: BrowserSupabaseClient);
    createAccount(email: Email, password: Password): Promise<User>;
    getUserFromLogin(email: Email, password: Password): Promise<User>;
    getUserFromSession(): Promise<User>;
    signOut(setSigningOut: React.Dispatch<React.SetStateAction<boolean>>): Promise<void>;
}
//# sourceMappingURL=SupabaseUserRepository.d.ts.map
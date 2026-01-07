import { Database } from "@/lib/supabase/database.types";
import { SupabaseClient } from "@supabase/supabase-js";
import { UserRepository, AuthError } from "@/domain/user/UserRepository";
import Email from "@/domain/user/Email";
import Password from "@/domain/user/Password";
import { requiredField } from "@/infrastructure/helper-functions";
import { BrowserSupabaseClient } from "@/lib/supabase/client";
import { User } from "@/domain/user/user"
import { UserId } from "@/domain/identity"

type Credentials = {
    email: string;
    password: string;
};

export class SupabaseUserRepository implements UserRepository {
    constructor (
        private supabase: BrowserSupabaseClient
    ) {}
    
    async getUserDetails(email: Email, password: Password): Promise<User> {        
        const credentials: Credentials = { email: email.value, password: password.value };
        const { data, error } = await this.supabase.auth.signInWithPassword(credentials);
        if (error) throw new AuthError(`Login failed: ${error}`);
        return new User(new UserId(data.user.id), Email.create(requiredField(data.user.email, AuthError, "data.user.email")));
    }

    async createAccount(email: Email, password: Password): Promise<User> {
        const credentials: Credentials = { email: email.value, password: password.value };
        const { data, error } = await this.supabase.auth.signUp(credentials);
        if (!data.user) throw new AuthError("Sign up failed. Try again.");
        if (error) throw new AuthError(`Sign up failed: ${error}`);
        return new User(new UserId(data.user.id),Email.create(requiredField(data.user.email, AuthError, "data.user.email")));
    }

    async signOut(signingOut: boolean, setSigningOut:  React.Dispatch<React.SetStateAction<boolean>>): Promise<void> {
        setSigningOut(true);
        const {error} = await this.supabase.auth.signOut();
        setSigningOut(false);
        if (error) throw error;
    }
}

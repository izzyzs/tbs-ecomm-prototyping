import { Database } from "@/lib/supabase/database.types";
import { SupabaseClient } from "@supabase/supabase-js";
import { UserRepository, AuthError } from "@/domain/user/UserRepository";
import Email from "@/domain/user/Email";
import Password from "@/domain/user/Password";
import { requiredField } from "@/infrastructure/helper-functions";
import { BrowserSupabaseClient } from "@/lib/supabase/client";
import { Role, RoleValue, User } from "@/domain/user/user"
import { UserId } from "@/domain/identity"
import { is } from "date-fns/locale";

type Credentials = {
    email: string;
    password: string;
};

export class SupabaseUserRepository implements UserRepository {
    constructor (
        private supabase: BrowserSupabaseClient
    ) {}

        async createAccount(email: Email, password: Password): Promise<User> {
        const credentials: Credentials = { email: email.value, password: password.value };
        const { data, error } = await this.supabase.auth.signUp(credentials);
        if (!data.user) throw new AuthError("Sign up failed. Try again.");
        if (error) throw new AuthError(`Sign up failed: ${error}`);
        return new User(new UserId(data.user.id),Email.create(requiredField(data.user.email, AuthError, "data.user.email")), true);
    }

    
    async getUserFromLogin(email: Email, password: Password): Promise<User> {        
        const credentials: Credentials = { email: email.value, password: password.value };
        const { data, error } = await this.supabase.auth.signInWithPassword(credentials);
        if (error) throw new AuthError(`Login failed: ${error}`);
        return new User(new UserId(data.user.id), Email.create(requiredField(data.user.email, AuthError, "data.user.email")), true);
    }

    async getUserFromSession(): Promise<User> {
        const { data: { session }, error } = await this.supabase.auth.getSession();
        const id = new UserId(requiredField(session?.user.id, AuthError, "session?.user.id"))
        const email = Email.create(requiredField(session?.user.email, AuthError, "session?.user.email"))
        const isAuthenticated: boolean = !!session
        const role = Role.create("customer", "standard");
        const user = new User(id, email, isAuthenticated, role);
        return user;
    }


    async signOut(setSigningOut:  React.Dispatch<React.SetStateAction<boolean>>): Promise<void> {
        setSigningOut(true);
        const {error} = await this.supabase.auth.signOut();
        setSigningOut(false);
        if (error) throw error;
    }
}

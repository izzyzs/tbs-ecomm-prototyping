import { Database } from "@/lib/supabase/index.js";
import { SupabaseClient } from "@supabase/supabase-js";
import {UserRepository, AuthError, Password } from "@tbs/core";
import { Email } from "@tbs/core";
import { requiredField } from "../../helper-functions.js";
import { BrowserSupabaseClient } from "../../lib/supabase/client.js";
import { Role, User } from "@tbs/core";
import { UserId } from "@tbs/core";

type Credentials = {
    email: string;
    password: string;
};

export class SupabaseUserRepository implements UserRepository {
    constructor(private supabase: BrowserSupabaseClient) {}

    async createAccount(email: Email, password: Password): Promise<User> {
        const credentials: Credentials = { email: email.value, password: password.value };
        const { data, error } = await this.supabase.auth.signUp(credentials);
        if (!data.user) throw new AuthError("Sign up failed. Try again.");
        if (error) throw new AuthError(`Sign up failed: ${error}`);
        return new User(new UserId(data.user.id), Email.create(requiredField(data.user.email, AuthError, "data.user.email")), true);
    }

    async getUserFromLogin(email: Email, password: Password): Promise<User> {
        const credentials: Credentials = { email: email.value, password: password.value };
        const { data, error } = await this.supabase.auth.signInWithPassword(credentials);
        if (error) throw new AuthError(`Login failed: ${error}`);
        return new User(new UserId(data.user.id), Email.create(requiredField(data.user.email, AuthError, "data.user.email")), true);
    }

    async getUserFromSession(): Promise<User | null> {
        const {
            data: { session },
            error,
        } = await this.supabase.auth.getSession();
        if (!session) return null;
        const id = new UserId(session.user.id);
        const email = Email.create(requiredField(session.user.email, AuthError, "session.user.email"));
        const isAuthenticated: boolean = !!session;
        const role = Role.create("customer", "standard");
        const user = new User(id, email, isAuthenticated, role);
        return user;
    }

    async signOut(): Promise<void> {
        const { error } = await this.supabase.auth.signOut();
        if (error) throw new AuthError(`Sign out failed: ${error.message}`);
    }
}

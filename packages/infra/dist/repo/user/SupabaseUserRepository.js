import { AuthError } from "@tbs/core";
import { Email } from "@tbs/core";
import { requiredField } from "../../helper-functions.js";
import { Role, User } from "@tbs/core";
import { UserId } from "@tbs/core";
export class SupabaseUserRepository {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async createAccount(email, password) {
        const credentials = { email: email.value, password: password.value };
        const { data, error } = await this.supabase.auth.signUp(credentials);
        if (!data.user)
            throw new AuthError("Sign up failed. Try again.");
        if (error)
            throw new AuthError(`Sign up failed: ${error}`);
        return new User(new UserId(data.user.id), Email.create(requiredField(data.user.email, AuthError, "data.user.email")), true);
    }
    async getUserFromLogin(email, password) {
        const credentials = { email: email.value, password: password.value };
        const { data, error } = await this.supabase.auth.signInWithPassword(credentials);
        if (error)
            throw new AuthError(`Login failed: ${error}`);
        return new User(new UserId(data.user.id), Email.create(requiredField(data.user.email, AuthError, "data.user.email")), true);
    }
    async getUserFromSession() {
        const { data: { session }, error, } = await this.supabase.auth.getSession();
        if (!session)
            return null;
        const id = new UserId(session.user.id);
        const email = Email.create(requiredField(session.user.email, AuthError, "session.user.email"));
        const isAuthenticated = !!session;
        const role = Role.create("customer", "standard");
        const user = new User(id, email, isAuthenticated, role);
        return user;
    }
    async signOut(setSigningOut) {
        setSigningOut(true);
        const { error } = await this.supabase.auth.signOut();
        setSigningOut(false);
        if (error)
            throw error;
    }
}

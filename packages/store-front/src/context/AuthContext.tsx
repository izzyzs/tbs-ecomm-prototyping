"use client";

import React, { useCallback, useMemo, useState, useEffect, useReducer } from "react";
import { useRouter } from "next/navigation";
// import { User } from "@supabase/supabase-js";
import { User } from "@tbs/core";
import { Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Credentials, SubmissionResponse } from "@/utils/types";
import { UserState } from "@tbs/view-models"
import { UserId } from "@tbs/core";
import { SupabaseUserRepository } from "@tbs/infra";
import { Email, Password } from "@tbs/core";
import { UserStateMapper } from "@tbs/view-models";

export interface AuthContextType {
    user: UserState | undefined;
    // userId: UserId | undefined;
    authLoading: boolean;
    isSigningOut: boolean;
    authError: string | null;
    setAuthError: React.Dispatch<React.SetStateAction<string | null>>;

    handleSignOut: () => Promise<void>;
    login: (_: SubmissionResponse | null, formData: FormData) => Promise<SubmissionResponse>;
    signup: (_: SubmissionResponse | null, formData: FormData) => Promise<SubmissionResponse>;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserState>();
    const [authError, setAuthError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [session, setSession] = useState<Session | null>(null);
    const supabase = useMemo(() => createClient(), []);
    const router = useRouter();
    const supabaseUserRepository = new SupabaseUserRepository(supabase);

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    useEffect(() => {
        let isMounted = true;

        const fetchSession = async () => {
            setLoading(true);
            try {
                const user = await supabaseUserRepository.getUserFromSession();
                if (!user) return;
                if (!isMounted) return;
                // setSession(session ?? null);
                const userState = UserStateMapper.toStateFromDomain(user);
                setUser(userState);
            } catch (error) {
                if (error instanceof Error) setAuthError(error.message);
                else setAuthError(JSON.stringify(error));
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchSession();

        return () => {
            isMounted = false;
        };
    }, [supabase, router]);

    // const oldLogin = useCallback(
    //     async (_: SubmissionResponse | null, formData: FormData): Promise<SubmissionResponse> => {
    //         const supabase = createClient();
    //         const email = formData.get("email")?.toString();
    //         const password = formData.get("password")?.toString();

    //         if (!email || !password) {
    //             return { msg: "Email and password are both required.", isError: true };
    //         }

    //         if (!validateEmail(email)) {
    //             return { msg: "Please enter a valid email address.", isError: true };
    //         }

    //         const credentials: Credentials = { email, password };
    //         const { data, error } = await supabase.auth.signInWithPassword(credentials);

    //         if (error) return { msg: "Login failed: " + error.message, isError: true };
    //         return { msg: `Welcome back ${data.user.email}`, isError: false };
    //     },
    //     [supabase, validateEmail]
    // );

    const login = useCallback(
        async (_: SubmissionResponse | null, formData: FormData): Promise<SubmissionResponse> => {
            const email = formData.get("email")?.toString();
            const password = formData.get("password")?.toString();

            if (!email || !password) {
                return { msg: "Email and password are both required.", isError: true };
            }

            let user;
            try {
                user = await supabaseUserRepository.getUserFromLogin(Email.create(email), Password.create(password));
                const userState = UserStateMapper.toStateFromDomain(user);
                setUser(userState);
            } catch (error) {
                console.error(error);
                return { msg: `Login failed: ${error}`, isError: true };
            }
            return { msg: `Welcome back ${user.email}`, isError: false };
        },
        [supabase]
    );

    // const oldSignup = useCallback(
    //     async (_: SubmissionResponse | null, formData: FormData): Promise<SubmissionResponse> => {
    //         const supabase = createClient();
    //         const email = formData.get("email")?.toString();
    //         const password = formData.get("password")?.toString();

    //         if (!email || !password) {
    //             return { msg: "Email and password are both required.", isError: true };
    //         }

    //         const credentials: Credentials = { email, password };
    //         const { data, error } = await supabase.auth.signUp(credentials);

    //         if (error) return { msg: "Signup failed: " + error.message, isError: true };
    //         return { msg: `Success!, ${data.user?.id} with email ${data.user?.email} is signed up!`, isError: false };
    //     },
    //     [supabase, validateEmail]
    // );

    const signup = useCallback(
        async (_: SubmissionResponse | null, formData: FormData): Promise<SubmissionResponse> => {
            const email = formData.get("email")?.toString();
            const password = formData.get("password")?.toString();

            if (!email || !password) {
                return { msg: "Email and password are both required.", isError: true };
            }

            let user;
            try {
                user = await supabaseUserRepository.createAccount(Email.create(email), Password.create(password));
            } catch (error) {
                return { msg: "Signup failed: " + error, isError: true };
            }

            return { msg: `Success!, ${user.id} with email ${user.email} is signed up!`, isError: false };
        },
        [supabase, validateEmail]
    );

    const handleSignOut = useCallback(async () => supabaseUserRepository.signOut(setIsSigningOut), [supabase, router]);

    // const signInAnonymously = async () => {
    //     const {
    //         data: { user },
    //         error,
    //     } = await supabase.auth.signInAnonymously();
    //     if (error) throw error;
    //     if (user) {
    //         console.log(user);
    //         setUser(user);
    //     }
    // };

    const auth = useMemo(
        () => ({
            user,
            authLoading: loading,
            authError,
            isSigningOut,
            handleSignOut,
            setAuthError,
            login,
            signup,
        }),
        [session, user, loading, authError]
    );

    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
    const ctx = React.useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider instance");
    return ctx;
}

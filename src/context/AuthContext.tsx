"use client";

import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Credentials, SubmissionResponse } from "@/utils/types";

export interface AuthContextType {
    user: User | undefined;
    userId: string | undefined;
    authLoading: boolean;
    isSigningOut: boolean;
    authError: string | null;
    setAuthError: React.Dispatch<React.SetStateAction<string | null>>;
    session: Session | null;

    handleSignOut: () => Promise<void>;
    login: (_: SubmissionResponse | null, formData: FormData) => Promise<SubmissionResponse>;
    signup: (_: SubmissionResponse | null, formData: FormData) => Promise<SubmissionResponse>;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User>();
    const [authError, setAuthError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [session, setSession] = useState<Session | null>(null);
    const supabase = useMemo(() => createClient(), []);
    const router = useRouter();

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    useEffect(() => {
        let isMounted = true;

        const fetchSession = async () => {
            setLoading(true);
            try {
                const {
                    data: { session },
                    error,
                } = await supabase.auth.getSession();
                if (!isMounted) return;
                setSession(session ?? null);
                setUser(session?.user);
                setAuthError(error ? error.message : null);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
            setSession(nextSession ?? null);
            console.log("event: ", _event, "\nnextSession in AUTH PROVIDER: ", nextSession);
            setUser(nextSession?.user);
            setAuthError(null);
            router.refresh();
        });

        return () => {
            isMounted = false;
            authListener?.subscription.unsubscribe();
        };
    }, [supabase, router]);

    const login = useCallback(
        async (_: SubmissionResponse | null, formData: FormData): Promise<SubmissionResponse> => {
            const supabase = createClient();
            const email = formData.get("email")?.toString();
            const password = formData.get("password")?.toString();

            if (!email || !password) {
                return { msg: "Email and password are both required.", isError: true };
            }

            if (!validateEmail(email)) {
                return { msg: "Please enter a valid email address.", isError: true };
            }

            const credentials: Credentials = { email, password };
            const { data, error } = await supabase.auth.signInWithPassword(credentials);

            if (error) return { msg: "Login failed: " + error.message, isError: true };
            return { msg: `Welcome back ${data.user.email}`, isError: false };
        },
        [supabase, validateEmail]
    );

    const signup = useCallback(
        async (_: SubmissionResponse | null, formData: FormData): Promise<SubmissionResponse> => {
            const supabase = createClient();
            const email = formData.get("email")?.toString();
            const password = formData.get("password")?.toString();

            if (!email || !password) {
                return { msg: "Email and password are both required.", isError: true };
            }

            const credentials: Credentials = { email, password };
            const { data, error } = await supabase.auth.signUp(credentials);

            if (error) return { msg: "Signup failed: " + error.message, isError: true };
            return { msg: `Success!, ${data.user?.id} with email ${data.user?.email} is signed up!`, isError: false };
        },
        [supabase, validateEmail]
    );

    const getErrorMessage = async (err: unknown): Promise<string> => {
        if (typeof err === "string") return err;
        if (err instanceof Error) return err.message;
        return "An error occurred. Please try again.";
    };

    const handleSignOut = useCallback(async () => {
        setIsSigningOut(true);
        try {
            const { error } = await supabase.auth.signOut();
            setIsSigningOut(false);
            if (error) {
                setAuthError(error.message);
                return;
            }
            setSession(null);
            router.refresh();
        } finally {
            setIsSigningOut(false);
        }
    }, [supabase, router]);

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
            session,
            user,
            userId: user?.id,
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

"use client";

import React from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export interface AuthContextType {
    user: User | undefined;
    userId: string | undefined;
    loading: boolean;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const supabase = createClient();
    const [user, setUser] = React.useState<User>();
    const [loading, setLoading] = React.useState<boolean>(true);

    const signInAnonymously = async () => {
        const {
            data: { user },
            error,
        } = await supabase.auth.signInAnonymously();
        if (error) throw error;
        if (user) {
            console.log(user);
            setUser(user);
        }
    };

    const getUser = async () => {
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();
        if (error) throw error;
        if (user) {
            console.log(user);
            setUser(user);
        } else signInAnonymously();
        setLoading(false);
    };

    React.useEffect(() => {
        setLoading(true);
        getUser();
    }, []);

    const auth: AuthContextType = {
        user,
        userId: user?.id,
        loading,
    };

    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
    const ctx = React.useContext(AuthContext);
    console.log("ctx?.user?.id", ctx?.user?.id);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider instance");
    return ctx;
}

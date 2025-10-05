"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import LoginModal from "@/components/nav/LoginModal";
import { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import SignUpModal from "@/components/nav/SignUpModal";

export default function UserStatusController() {
    const supabase = useMemo(() => createClient(), []);
    const [session, setSession] = useState<Session | null>(null);
    const [authError, setAuthError] = useState<string | null>(null);
    const [loginIsOpen, setLoginIsOpen] = useState(false);
    const [signUpIsOpen, setSignUpIsOpen] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (!isMounted) return;
            setSession(data.session ?? null);
            setAuthError(error?.message ?? null);
        };

        fetchSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
            setSession(nextSession ?? null);
            setAuthError(null);
        });

        return () => {
            isMounted = false;
            authListener?.subscription.unsubscribe();
        };
    }, [supabase]);

    const handleSignOut = useCallback(async () => {
        setIsSigningOut(true);
        const { error } = await supabase.auth.signOut();
        setIsSigningOut(false);
        if (error) {
            setAuthError(error.message);
            return;
        }
        setSession(null);
    }, [supabase]);

    if (session) {
        return (
            <div className="flex items-center gap-3">
                <p className="text-sm text-muted-foreground">Welcome back, {session.user.email}!</p>
                <Button variant="outline" size="sm" onClick={handleSignOut} disabled={isSigningOut}>
                    {isSigningOut ? "Signing out..." : "Sign out"}
                </Button>
                {authError && <p className="text-xs text-red-600" role="alert">{authError}</p>}
            </div>
        );
    }

    return (
        <>
            <LoginModal
                open={loginIsOpen}
                setOpen={setLoginIsOpen}
                openSignUp={setSignUpIsOpen}
                externalError={authError}
            />
            <SignUpModal open={signUpIsOpen} setOpen={setSignUpIsOpen} openLogin={setLoginIsOpen} externalError={authError} />
        </>
    );
}

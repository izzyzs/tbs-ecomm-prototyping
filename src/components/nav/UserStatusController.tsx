"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import LoginModal from "@/components/nav/LoginModal";
import { Button } from "@/components/ui/button";
import SignUpModal from "@/components/nav/SignUpModal";
import { Loader } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// TODO: 🔒 AUTH REFACTOR — Move session retrieval to the SERVER
// -------------------------------------------------------------
// 1️⃣  Fetch the Supabase session on the server side (e.g., in NavBar.tsx):
//     const supabase = await createClient();
//     const { data: { session } } = await supabase.auth.getSession();
//
// 2️⃣  Pass that session down to the UserStatusController as a prop:
//     <UserStatusController initialSession={session} />
//
// 3️⃣  Update UserStatusController to accept { initialSession }:
//     export default function UserStatusController({ initialSession }: { initialSession: Session | null }) {
//         const [session, setSession] = useState<Session | null>(initialSession);
//         ...
//     }
//
// 4️⃣  Keep client-side sync using supabase.auth.onAuthStateChange() — this will
//     update the state after sign-in / sign-out events.
//
// 5️⃣  Result: No flicker, consistent server/client auth state, cleaner UX.

export default function UserStatusController() {
    const { handleSignOut, isSigningOut, authLoading, authError, user, setAuthError } = useAuth();

    const [loginIsOpen, setLoginIsOpen] = useState(false);
    const [signUpIsOpen, setSignUpIsOpen] = useState(false);

    if (authLoading) {
        return <Loader className="animate-spin" />;
    }

    if (!user) {
        return (
            <>
                <LoginModal
                    open={loginIsOpen}
                    setOpen={(b) => {
                        if (!b) setAuthError(null);
                        setLoginIsOpen(b);
                    }}
                    openSignUp={setSignUpIsOpen}
                    externalError={authError}
                />
                <SignUpModal
                    open={signUpIsOpen}
                    setOpen={(b) => {
                        if (!b) setAuthError(null);
                        setSignUpIsOpen(b);
                    }}
                    openLogin={setLoginIsOpen}
                    externalError={authError}
                />
            </>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">Welcome back, {user.email}!</p>
            <Button variant="outline" size="sm" onClick={handleSignOut} disabled={isSigningOut}>
                {isSigningOut ? "Signing out..." : "Sign out"}
            </Button>
            {authError && (
                <p className="text-xs text-red-600" role="alert">
                    {authError}
                </p>
            )}
        </div>
    );
}

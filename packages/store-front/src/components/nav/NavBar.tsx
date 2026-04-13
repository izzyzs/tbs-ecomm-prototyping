import React from "react";

import UserStatusController from "@/components/nav/UserStatusController";
import Link from "next/link";
import CartButton from "@/components/nav/buttons/CartButton";
import AccountButton from "@/components/nav/buttons/AccountButton";
import ProductCategories from "./ProductCategories";

// TODO: 🔒 AUTH REFACTOR — Move Supabase session retrieval here (SERVER SIDE)
// ---------------------------------------------------------------------------
// 1️⃣  Import the Supabase server client at the top of this file:
//     import { createClient } from "@/lib/supabase/server";
//
// 2️⃣  Fetch the current user session before rendering the nav:
//     const supabase = await createClient();
//     const { data: { session } } = await supabase.auth.getSession();
//
// 3️⃣  Pass the session to the UserStatusController as a prop:
//     <UserStatusController initialSession={session} />
//
// 4️⃣  Remove client-side getSession() calls inside UserStatusController —
//     it should now *start* with the server session (passed as a prop) and
//     only use supabase.auth.onAuthStateChange() to stay in sync.
//
// 5️⃣  Benefit: The navbar and user status will render correctly on first load
//     without waiting for client hydration (no flicker or delayed auth state).

const NavBar = () => {
    return (
        <>
            {/* Navigation bar with logo, links, and login button */}
            <nav className="fixed bottom-0 z-50 w-full border-t border-[var(--tbs-border-strong)] bg-[rgba(255,249,242,0.92)] px-4 py-3 shadow-[0_-18px_40px_-26px_rgba(91,11,87,0.28)] backdrop-blur-xl sm:sticky sm:top-0 sm:border-b sm:border-t-0 sm:px-6 sm:py-4 sm:shadow-[0_18px_40px_-28px_rgba(91,11,87,0.24)]">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
                    <Link href="/" className="group min-w-0">
                        <span className="block text-[0.68rem] font-semibold tracking-[0.34em] text-[var(--tbs-pink-deep)] uppercase">Today&apos;s</span>
                        <span className="bg-[linear-gradient(135deg,var(--tbs-pink)_0%,var(--tbs-pink-deep)_56%,var(--tbs-plum)_100%)] bg-clip-text text-lg font-black tracking-tight text-transparent sm:text-xl">
                            Beauty Supply
                        </span>
                    </Link>
                    {/*<ProductCategories />*/}
                    {/* ^^^^^^^^^^^^^^^^ is not currently necessary; we're streamlining and sliming down*/}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* <SearchButton /> */}
                        <CartButton />
                        <AccountButton />
                        <UserStatusController />
                    </div>
                </div>
                {/* <ProductCategories /> */}
            </nav>
        </>
    );
};

export default NavBar;

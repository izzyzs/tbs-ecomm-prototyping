import React from "react";

import UserStatusController from "@/components/nav/UserStatusController";
import ProductCategories from "@/components/nav/ProductCategories";
import Link from "next/link";
import CartButton from "@/components/nav/buttons/CartButton";
import SearchButton from "@/components/nav/buttons/SearchButton";
import AccountButton from "@/components/nav/buttons/AccountButton";

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
            <nav className="z-50 w-full flex items-center justify-between px-4 py-4 bg-white shadow-md fixed bottom-0 sm:bottom-auto sm:sticky sm:top-0 sm:z-50">
                <Link href="/" className="text-xl font-bold">
                    Beauty Supply
                </Link>
                <ProductCategories />
                <div className="flex items-center space-x-4">
                    {/* <Link href="/shop" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                        Shop
                    </Link> */}
                    {/* <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                        About
                    </a> */}
                    {/* Login button opens a modal using Shadcn's Dialog component */}
                    <SearchButton />
                    <CartButton />
                    <AccountButton />
                    <UserStatusController />
                </div>
            </nav>
        </>
    );
};

export default NavBar;

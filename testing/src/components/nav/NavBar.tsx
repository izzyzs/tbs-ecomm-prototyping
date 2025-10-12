import React from "react";

import UserStatusController from "@/components/nav/UserStatusController";
import ProductCategories from "@/components/nav/ProductCategories";
import Link from "next/link";

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

                    <UserStatusController />
                </div>
            </nav>
        </>
    );
};

export default NavBar;

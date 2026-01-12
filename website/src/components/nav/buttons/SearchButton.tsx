"use client";

import React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const SearchButton = () => {
    const cart = useCart();
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Link href={"/shop"} className="text-gray-400 hover:text-gray-900 relative">
                    <Search />
                </Link>
            </TooltipTrigger>
            <TooltipContent>
                <p>Search</p>
            </TooltipContent>
        </Tooltip>
    );
};

export default SearchButton;

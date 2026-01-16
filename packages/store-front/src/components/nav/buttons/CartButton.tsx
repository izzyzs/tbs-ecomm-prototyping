"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const CartButton = () => {
    const cart = useCart();
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Link href={"/cart"} className="text-gray-400 hover:text-gray-900 relative">
                    <ShoppingCart />
                    <span className="absolute -top-1 -right-1 bg-red-400 text-white text-xs px-1 rounded-full">{cart.count()}</span>
                </Link>
            </TooltipTrigger>
            <TooltipContent>
                <p>Cart</p>
            </TooltipContent>
        </Tooltip>
    );
};

export default CartButton;

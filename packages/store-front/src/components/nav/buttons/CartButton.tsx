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
                <Link
                    href={"/cart"}
                    className="relative inline-flex size-11 items-center justify-center rounded-full border border-[var(--tbs-border)] bg-white/80 text-[var(--tbs-plum)] shadow-[0_12px_24px_-20px_rgba(91,11,87,0.26)] transition-all hover:-translate-y-0.5 hover:border-[var(--tbs-border-strong)] hover:bg-[rgba(255,240,247,0.9)]"
                >
                    <ShoppingCart />
                    <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--tbs-gold)_0%,#ffcf4c_100%)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--tbs-plum)] shadow-[0_10px_20px_-12px_rgba(91,11,87,0.4)]">
                        {cart.count()}
                    </span>
                </Link>
            </TooltipTrigger>
            <TooltipContent sideOffset={8} className="rounded-full bg-[var(--tbs-plum)] px-3 py-1 text-[var(--tbs-cream)]">
                <p>Cart</p>
            </TooltipContent>
        </Tooltip>
    );
};

export default CartButton;

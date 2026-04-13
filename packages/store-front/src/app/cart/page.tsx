import React from "react";
import { ShoppingBag } from "lucide-react";
import CartSummary from "@/components/cart/CartSummary";
import OrderOverview from "@/components/cart/OrderOverview";

// type MockCartItem = {
//     id: number;
//     name: string;
//     brand: string;
//     description: string;
//     size: string;
//     price: number;
//     quantity: number;
// };

export default function CartPage() {
    return (
        <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-4 sm:px-6 lg:px-8">
            <div className="tbs-shell">
                <div className="tbs-hero px-5 py-6 sm:px-8 sm:py-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="max-w-3xl">
                            <p className="tbs-kicker">Cart</p>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--tbs-plum)] sm:text-4xl">Your cart is ready when you are.</h1>
                            <p className="mt-3 text-sm leading-6 text-[rgba(63,22,60,0.72)] sm:text-base">
                                Double-check your items, update quantities, and head to checkout when everything looks right.
                            </p>
                        </div>

                        <div className="tbs-icon-badge size-14 shrink-0">
                            <ShoppingBag className="size-6" />
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[1.15fr_0.85fr]">
                    <CartSummary />

                    <div className="space-y-6">
                        <OrderOverview />
                    </div>
                </div>
            </div>
        </main>
    );
}

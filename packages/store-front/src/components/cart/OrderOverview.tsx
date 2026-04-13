"use client";
import React from "react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/utils/helper-functions";
import { Button } from "@/components/my-button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

const OrderOverview = () => {
    const { subtotal, count } = useCart();
    const router = useRouter();
    const hasItemsInCart = count() > 0;

    return (
        <div className="tbs-panel p-6">
            <p className="tbs-kicker">Order Overview</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--tbs-plum)]">Your total before checkout.</h2>

            <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between text-sm text-[rgba(63,22,60,0.72)]">
                    <span>Subtotal</span>
                    <span className="text-base font-semibold text-[var(--tbs-plum)]">{formatCurrency(subtotal())}</span>
                </div>

                <div className="tbs-divider" />

                <div className="tbs-highlight-panel p-4">
                    <div className="flex items-start gap-3">
                        <div className="tbs-icon-badge size-10 shrink-0 rounded-2xl">
                            <Sparkles className="size-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-[var(--tbs-plum)]">Almost there</h3>
                            <p className="mt-1 text-sm leading-6 text-[rgba(63,22,60,0.68)]">Continue to checkout to confirm your pickup details and complete your order.</p>
                        </div>
                    </div>
                </div>
            </div>

            <Button className="mt-6 w-full" onClick={() => router.push("/checkout")} disabled={!hasItemsInCart}>
                Proceed to Checkout
                <ArrowRight className="size-4" />
            </Button>
            <Button variant="ghost" className="mt-2 w-full text-[rgba(63,22,60,0.72)]" onClick={() => router.push("/")}>
                Continue Shopping
            </Button>
        </div>
    );
};

export default OrderOverview;

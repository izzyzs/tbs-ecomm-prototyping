import React from "react";
import { Button } from "@/components/ui/button";
import { Package, ShieldCheck, ShoppingBag, Trash2, Truck } from "lucide-react";
import { formatCurrency } from "@/utils/helper-functions";
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
    // const freeShippingThreshold = 125;
    // const qualifiesForFreeShipping = subtotal >= freeShippingThreshold;
    // const remainingForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);
    // const shipping = qualifiesForFreeShipping ? 0 : 9.99;
    // const tax = Math.round(subtotal * 0.0825 * 100) / 100;
    // const orderTotal = Math.round((subtotal + shipping + tax) * 100) / 100;

    return (
        <>
            <section className="relative bg-gradient-to-r from-pink-100 via-rose-50 to-orange-50 py-16 px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-pink-500" />
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Your Cart</h1>
                    <p className="mt-3 text-lg text-gray-700">Review your essentials and finalize your next restock with confidence.</p>
                </div>
            </section>

            <section className="relative z-10 -mt-12 px-6 pb-16">
                <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[2fr_1fr]">
                    <CartSummary />

                    <div className="space-y-6">
                        <OrderOverview />
                        <div className="rounded-xl border border-rose-100 bg-gradient-to-r from-pink-50 via-rose-50 to-orange-50 p-6 shadow-sm">
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="h-10 w-10 text-pink-500" />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Salon Partner Perks</h3>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Enjoy pro-only pricing, curated assortments, and priority fulfillment on every order. Questions? Our team responds within 24 hours.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

"use client";
import React from "react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/utils/helper-functions";
import { Button } from "@/components/ui/button";
import { Truck } from "lucide-react";

const OrderOverview = () => {
    const { qualifiesForFreeShipping, remainingForFreeShipping, shipping, tax, orderTotal, subtotal } = useCart();

    return (
        <div className="rounded-xl border border-rose-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Order Overview</h2>
            <div className="mt-5 space-y-4 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal())}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span>Estimated tax</span>
                    <span>{formatCurrency(tax())}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span>{qualifiesForFreeShipping() ? "Free" : formatCurrency(shipping())}</span>
                </div>
                <div className="h-px bg-rose-100" />
                <div className="flex items-center justify-between text-base font-semibold text-gray-900">
                    <span>Total due</span>
                    <span>{formatCurrency(orderTotal())}</span>
                </div>
            </div>
            <Button className="mt-6 w-full">Proceed to Checkout</Button>
            <Button variant="ghost" className="mt-2 w-full text-gray-600">
                Continue Shopping
            </Button>
            <div className="mt-4 flex items-start gap-3 rounded-lg bg-pink-50 px-4 py-3 text-sm text-gray-600">
                <Truck className="mt-0.5 h-4 w-4 text-pink-500" />
                {qualifiesForFreeShipping()
                    ? "You qualify for complimentary shipping on this order."
                    : `Add ${formatCurrency(remainingForFreeShipping())} more in product value to unlock complimentary shipping.`}
            </div>
        </div>
    );
};

export default OrderOverview;

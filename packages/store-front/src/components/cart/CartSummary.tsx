// system_id, upc, ean, custom_sku, manufact_sku, item, vendor_id, qty, price, tax, brand, publish_to_ecom, season, department, msrp, tax_class, default_cost, vendor, category, subcategory, subcategory_2,subcategory_3, subcategory_4, subcategory_5, subcategory_6, subcategory_7, subcategory_8, subcategory_9
"use client";
import React from "react";
import { Button } from "@/components/my-button";
import { useCart } from "@/context/CartContext";
import { Truck, Trash2, Plus, Minus } from "lucide-react";
import { formatCurrency } from "@/utils/helper-functions";
import createToast from "./createToast";

const CartSummary = () => {
    const { cartItems, add, decrement, remove } = useCart();

    const handleAdd = (productId: number) => createToast(add(productId));
    const handleDecrement = (productId: number) => createToast(decrement(productId));
    const handleRemove = (productId: number) => createToast(remove(productId));

    return (
        <div className="tbs-panel overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-[var(--tbs-border-strong)] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="tbs-kicker">Cart Summary</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--tbs-plum)]">Review the items you picked.</h2>
                    <p className="mt-2 text-sm leading-6 text-[rgba(63,22,60,0.68)]">Adjust your quantity, remove anything you don&apos;t need, and make sure your order is exactly how you want it.</p>
                </div>
                <span className="tbs-chip">{cartItems.length} {cartItems.length === 1 ? "item" : "items"}</span>
            </div>

            <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
                {cartItems.length === 0 ? (
                    <div className="tbs-panel-soft px-6 py-10 text-center">
                        <p className="tbs-kicker">Your cart is empty</p>
                        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--tbs-plum)]">Looks like you haven&apos;t added anything yet.</h3>
                        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[rgba(63,22,60,0.68)]">
                            Start shopping to fill your cart with your go-to beauty products, hair care, and everyday essentials.
                        </p>
                    </div>
                ) : (
                    cartItems.map((item, idx) => {
                        const itemName = formatDisplayValue(item.name);
                        const brandName = formatDisplayValue(item.brand);
                        const initials = buildInitials(itemName);

                        return (
                            <article
                                key={idx}
                                className="rounded-[1.5rem] border border-[var(--tbs-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,240,247,0.92)_74%,rgba(255,248,235,0.9))] p-4 shadow-[0_20px_44px_-34px_rgba(91,11,87,0.34)]"
                            >
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                                    <div className="relative flex h-36 w-full items-center justify-center overflow-hidden rounded-[1.35rem] border border-[var(--tbs-border-strong)] bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(255,241,247,0.92)_58%,rgba(255,248,235,0.92))] sm:w-36">
                                        <div className="absolute -left-6 top-3 h-16 w-16 rounded-full bg-[rgba(244,182,29,0.22)] blur-2xl" />
                                        <div className="absolute bottom-0 right-0 h-20 w-20 rounded-full bg-[rgba(246,31,141,0.16)] blur-2xl" />
                                        <div className="absolute inset-3 rounded-[1rem] border border-dashed border-[rgba(207,12,116,0.16)]" />
                                        <div className="relative flex h-20 w-20 items-center justify-center rounded-[1.4rem] border border-white/80 bg-white/90 text-xl font-semibold tracking-[0.16em] text-[var(--tbs-plum)] shadow-[0_14px_28px_-18px_rgba(91,11,87,0.3)]">
                                            {initials || "TBS"}
                                        </div>
                                    </div>

                                    <div className="flex flex-1 flex-col">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <div className="flex flex-wrap gap-2">
                                                    {item.brand?.trim() ? <span className="tbs-chip-soft text-xs font-semibold">{brandName}</span> : null}
                                                    <span className="inline-flex items-center rounded-full bg-[rgba(91,11,87,0.06)] px-3 py-1 text-xs font-medium text-[rgba(63,22,60,0.64)]">
                                                        #{item.productId}
                                                    </span>
                                                </div>
                                                <h3 className="mt-3 text-xl font-semibold tracking-tight text-[var(--tbs-plum)]">{itemName}</h3>
                                                <p className="mt-2 text-sm font-medium text-[rgba(63,22,60,0.68)]">{formatCurrency(item.price)} each</p>
                                            </div>

                                            <p className="text-lg font-semibold text-[var(--tbs-plum)]">{formatCurrency(item.price * item.quantity)}</p>
                                        </div>

                                        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--tbs-border)] bg-white/85 px-2 py-2 shadow-[0_12px_24px_-18px_rgba(91,11,87,0.18)]">
                                                <Button
                                                    onClick={() => handleDecrement(item.productId)}
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    className="border border-transparent text-[var(--tbs-pink-deep)] hover:border-[var(--tbs-border-strong)] hover:bg-transparent"
                                                >
                                                    <Minus />
                                                </Button>
                                                <span className="min-w-16 text-center text-sm font-semibold text-[var(--tbs-plum)]">Qty {item.quantity}</span>
                                                <Button
                                                    onClick={() => handleAdd(item.productId)}
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    className="border border-transparent text-[var(--tbs-pink-deep)] hover:border-[var(--tbs-border-strong)] hover:bg-transparent"
                                                >
                                                    <Plus />
                                                </Button>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3">
                                                <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(255,240,247,0.82)] px-3 py-1.5 text-sm font-medium text-[var(--tbs-plum)]">
                                                    <Truck className="h-4 w-4 text-[var(--tbs-pink-deep)]" />
                                                    Ready for pickup
                                                </div>
                                                <Button onClick={() => handleRemove(item.productId)} variant="ghost" size="sm" className="text-[rgba(63,22,60,0.68)] hover:text-[var(--tbs-pink-deep)]">
                                                    <Trash2 className="h-4 w-4" />
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default CartSummary;

function formatDisplayValue(value?: string | null) {
    if (!value?.trim()) return "Unspecified";

    return value.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
}

function buildInitials(value: string) {
    return value
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase() ?? "")
        .join("");
}

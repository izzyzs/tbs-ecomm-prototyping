import React from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import AddToCartButton from "@/components/product/AddToCartButton";
import SeeMoreButton from "@/components/product/SeeMoreButton";
import { Money } from "@tbs/core";

type ProductSubset = { id: number; item: string | null; price: string | null };

export default function ProductCard({ id, item: name, price }: ProductSubset) {
    const productName = formatDisplayValue(name);
    const initials = productName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase() ?? "")
        .join("");

    return (
        <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[var(--tbs-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,241,247,0.95)_72%,rgba(255,248,235,0.94))] p-4 shadow-[0_22px_52px_-34px_rgba(91,11,87,0.32)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--tbs-border-strong)] hover:shadow-[0_28px_64px_-36px_rgba(91,11,87,0.4)]">
            <Link href={`/product/${id}`} className="absolute inset-0 z-0" aria-label={`View details for ${productName}`}>
                <span className="sr-only">View {productName}</span>
            </Link>

            <div className="relative z-10 flex flex-1 flex-col">
                <div className="flex items-center justify-between gap-3">
                    <span className="tbs-chip-soft text-[10px] font-semibold tracking-[0.24em] uppercase">TBS Pick</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(244,182,29,0.16)] px-3 py-1 text-xs font-medium text-[var(--tbs-plum)]">
                        <Sparkles className="size-3.5 text-[var(--tbs-gold)]" />
                        Featured
                    </span>
                </div>

                <div className="relative mt-4 flex min-h-[200px] items-center justify-center overflow-hidden rounded-[1.5rem] border border-[var(--tbs-border-strong)] bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(255,241,247,0.92)_58%,rgba(255,248,235,0.92)_100%)] p-6">
                    <div className="absolute -left-10 top-5 h-24 w-24 rounded-full bg-[rgba(244,182,29,0.22)] blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-[rgba(246,31,141,0.18)] blur-3xl" />
                    <div className="absolute inset-4 rounded-[1.25rem] border border-dashed border-[rgba(207,12,116,0.16)]" />

                    <div className="relative flex flex-col items-center text-center">
                        <div className="flex h-24 w-24 items-center justify-center rounded-[1.75rem] border border-white/80 bg-white/90 text-2xl font-semibold tracking-[0.18em] text-[var(--tbs-plum)] shadow-[0_18px_38px_-24px_rgba(91,11,87,0.32)]">
                            {initials || "TBS"}
                        </div>
                        <p className="mt-4 text-xs font-medium tracking-[0.22em] text-[var(--tbs-pink-deep)] uppercase">Salon-ready staple</p>
                    </div>
                </div>

                <div className="mt-5 flex flex-1 flex-col justify-between gap-4">
                    <div>
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="tbs-kicker">Catalog Essential</p>
                                <h3 className="mt-2 text-lg font-semibold leading-tight text-[var(--tbs-plum)]">{productName}</h3>
                            </div>
                            <ArrowUpRight className="mt-1 size-4 text-[var(--tbs-pink-deep)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                        <p className="mt-3 text-sm font-medium text-[rgba(63,22,60,0.74)]">{price ?? "N/A"}</p>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                        <SeeMoreButton size="sm" variant="secondary" className="w-full" productId={id}>
                            See More
                        </SeeMoreButton>
                        <AddToCartButton size="sm" className="w-full" productId={id}>
                            Add to Cart
                        </AddToCartButton>
                    </div>
                </div>
            </div>

            <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] border border-transparent transition-colors duration-300 group-hover:border-[rgba(246,31,141,0.22)]" />
        </article>
    );
}

function formatDisplayValue(value?: string | null) {
    if (!value?.trim()) return "Unspecified";

    return value.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
}

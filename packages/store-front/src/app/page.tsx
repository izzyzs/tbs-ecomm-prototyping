import React from "react";
import { Clock3, Sparkles, Store, WandSparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/product/ProductCard";
import ShopNowButton from "@/components/home/ShopNowButton";
import { Database } from "@tbs/infra";

type GetRandomProductsReturnType = Database["public"]["Functions"]["get_random_products"]["Returns"][number];

const HomePage = async () => {
    const supabase = await createClient();

    const { data: products } = await supabase.rpc("get_active_products");
    const featuredProducts = products?.slice(0, 8) ?? [];

    return (
        <section className="mx-auto w-full max-w-7xl px-4 pb-12 pt-4 sm:px-6 lg:px-8">
            <div className="tbs-shell">
                <div className="tbs-hero px-5 py-8 sm:px-8 sm:py-10">
                    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                        <div className="max-w-3xl">
                            <p className="tbs-kicker">Today&apos;s Beauty Supply</p>
                            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-[var(--tbs-plum)] sm:text-5xl">
                                Your beauty favorites, all in one easy stop.
                            </h1>
                            <p className="mt-4 max-w-2xl text-sm leading-7 text-[rgba(63,22,60,0.72)] sm:text-base">
                                Shop hair care, braiding essentials, skincare, and everyday salon staples without the extra running around. Add what you need, check out online, and get ready for a quick pickup.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <span className="tbs-chip">
                                    <Store className="size-4 text-[var(--tbs-pink-deep)]" />
                                    Trusted beauty supply source
                                </span>
                                <span className="tbs-chip">
                                    <Clock3 className="size-4 text-[var(--tbs-gold)]" />
                                    Order online, pick up fast
                                </span>
                            </div>

                            <div className="mt-8">
                                <ShopNowButton />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="tbs-panel-soft relative min-h-[180px] overflow-hidden p-5 sm:col-span-2">
                                <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-[rgba(244,182,29,0.22)] blur-3xl" />
                                <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-[rgba(246,31,141,0.16)] blur-3xl" />
                                <div className="relative">
                                    <span className="tbs-chip-soft text-xs font-semibold tracking-[0.22em] uppercase">Why Shop TBS</span>
                                    <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--tbs-plum)]">Stock up on the products you reach for again and again.</h2>
                                    <p className="mt-3 max-w-md text-sm leading-6 text-[rgba(63,22,60,0.72)]">
                                        From everyday beauty basics to salon-ready staples, we make it simple to find what you need and keep your routine on track.
                                    </p>
                                </div>
                            </div>

                            <div className="tbs-panel p-5">
                                <div className="tbs-icon-badge size-11">
                                    <Sparkles className="size-5" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-[var(--tbs-plum)]">Beauty essentials</h3>
                                <p className="mt-2 text-sm leading-6 text-[rgba(63,22,60,0.68)]">Find the go-to products you use for daily care, touch-ups, restocks, and everything in between.</p>
                            </div>

                            <div className="tbs-panel p-5">
                                <div className="tbs-icon-badge size-11">
                                    <WandSparkles className="size-5" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-[var(--tbs-plum)]">Easy shopping</h3>
                                <p className="mt-2 text-sm leading-6 text-[rgba(63,22,60,0.68)]">Browse, add to cart, and head to checkout without the hassle when you already know what you want.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-4 py-5 sm:px-6 sm:py-7">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="tbs-kicker">Shop Favorites</p>
                            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--tbs-plum)] sm:text-3xl">Popular picks right now</h2>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-[rgba(63,22,60,0.7)]">Take a look at customer-loved essentials and salon staples ready to add to your cart today.</p>
                        </div>
                        <span className="tbs-chip">{featuredProducts.length} products to explore</span>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                        {featuredProducts.map((product: GetRandomProductsReturnType, idx: number) => (
                            <ProductCard id={product.id} item={product.item} price={`$${product.price_in_pennies! / 100}`} key={idx} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomePage;

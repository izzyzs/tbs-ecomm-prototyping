import React, { Fragment } from "react";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import { PostgrestError } from "@supabase/supabase-js";

type ProductSubset = { id: number; item: string; price: number };

export default async function Page({ params }: { params: Promise<{ categoryName: string }> }) {
    const supabase = await createClient();
    const { categoryName } = await params;
    const decodedName = decodeURIComponent(categoryName);

    const { data, error: categoryIdError } = await supabase.from("categories").select("id, path").eq("slug", categoryName).single();
    if (!data) throw new Error(`${categoryName} not found`);
    if (categoryIdError) throw categoryIdError;
    const { id: categoryId, path } = data as { id: number; path: string };
    // const { data: products, error } = (await supabase.from("inventory").select("id, item, price").eq("category_id", categoryId).eq("publish_to_ecom", true)) as { data: ProductSubset[] | null; error: PostgrestError };
    const { data: products, error } = (await supabase.from("inventory").select("id, item, price").eq("category_id", categoryId)) as { data: ProductSubset[] | null; error: PostgrestError };

    if (!products || products.length < 1)
        return (
            <section className="mx-auto flex min-h-[60vh] w-full max-w-4xl items-center px-4 py-10 sm:px-6 lg:px-8">
                <div className="tbs-shell w-full px-8 py-12 text-center">
                    <p className="tbs-kicker">Category unavailable</p>
                    <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--tbs-plum)] sm:text-4xl">Category &quot;{`${categoryName}`}&quot; not found</h1>
                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[rgba(63,22,60,0.72)] sm:text-base">
                        The category you&#39;re looking for doesn&#39;t exist, has no visible products yet, or may have been removed from the storefront.
                    </p>
                    <Link href="/shop" className="mt-8 inline-flex rounded-full bg-[linear-gradient(135deg,var(--tbs-pink)_0%,var(--tbs-pink-deep)_72%,var(--tbs-plum)_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_38px_-24px_rgba(91,11,87,0.48)] transition-transform hover:-translate-y-0.5">
                        Continue shopping
                    </Link>
                </div>
            </section>
        );
    if (error) throw error;
    if (categoryIdError) throw categoryIdError;

    const pathArray: string[] = path.split(".");
    console.log("pathArray", pathArray);
    const nameAndSlug: [string, string][] = [];
    for (let i = 0; i < pathArray.length; i++) {
        const { data, error: parentNameError } = await supabase.from("categories").select("name").eq("slug", pathArray[i]).single();
        if (!data) throw new Error("category is missing");
        if (parentNameError) throw parentNameError;
        console.log("name", data.name);
        nameAndSlug.push([data.name, pathArray[i]]);
    }
    // console.log("path", path);
    // console.log("pathArray", pathArray);
    const parent = pathArray.length >= 2 ? pathArray[pathArray.length - 2] : undefined;
    // console.log("parent", parent);
    const currentCategory = nameAndSlug[nameAndSlug.length - 1]?.[0] ?? decodedName;
    const productCountLabel = `${products.length} ${products.length === 1 ? "product" : "products"}`;

    return (
        <section className="mx-auto w-full max-w-7xl px-4 pb-12 pt-4 sm:px-6 lg:px-8">
            <div className="tbs-shell">
                <div className="tbs-hero px-5 py-6 sm:px-8 sm:py-8">
                    {parent ? (
                        <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-y-2 text-sm text-[rgba(63,22,60,0.64)]">
                            {nameAndSlug.map((value, idx) => {
                                if (idx === 0)
                                    return (
                                        <Link key={idx} className="rounded-full bg-white/80 px-3 py-1.5 font-medium text-[rgba(63,22,60,0.7)] transition-colors hover:text-[var(--tbs-pink-deep)]" href={`/shop/${value[1]}`}>
                                            {value[0]}
                                        </Link>
                                    );
                                else
                                    return (
                                        <Fragment key={idx}>
                                            <span className="px-1 text-[rgba(246,31,141,0.42)]">{`>`}</span>
                                            <Link className="rounded-full bg-white/70 px-3 py-1.5 font-medium text-[rgba(63,22,60,0.7)] transition-colors hover:text-[var(--tbs-pink-deep)]" href={`/shop/${value[1]}`}>
                                                {`${value[0]}`}
                                            </Link>
                                        </Fragment>
                                    );
                            })}
                        </nav>
                    ) : (
                        <div className="mb-4">
                            <Link href="/shop" className="inline-flex rounded-full bg-white/80 px-3 py-1.5 text-sm font-medium text-[rgba(63,22,60,0.7)] transition-colors hover:text-[var(--tbs-pink-deep)]">
                                All categories
                            </Link>
                        </div>
                    )}

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="max-w-3xl">
                            <p className="tbs-kicker">Category page</p>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--tbs-plum)] sm:text-4xl">{currentCategory}</h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-[rgba(63,22,60,0.72)] sm:text-base">
                                Browse everything currently listed under this category and jump into any product card for more detail.
                            </p>
                        </div>

                        <div className="tbs-chip">
                            {productCountLabel}
                        </div>
                    </div>
                </div>

                <div className="px-4 py-5 sm:px-6 sm:py-7">
                    <main className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        {products?.map((product: ProductSubset, idx: number) => (
                            <ProductCard key={idx} id={product.id} item={product.item} price={`$${product.price!/100}`} />
                        ))}
                    </main>
                </div>
            </div>
        </section>
    );
}

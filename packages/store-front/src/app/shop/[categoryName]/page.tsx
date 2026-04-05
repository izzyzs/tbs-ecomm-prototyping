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
                <div className="w-full rounded-[2rem] border border-rose-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(255,245,247,0.92)_100%)] px-8 py-12 text-center shadow-[0_24px_80px_-40px_rgba(190,24,93,0.45)]">
                    <p className="text-xs font-semibold tracking-[0.28em] text-rose-500 uppercase">Category unavailable</p>
                    <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Category &quot;{`${categoryName}`}&quot; not found</h1>
                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                        The category you&#39;re looking for doesn&#39;t exist, has no visible products yet, or may have been removed from the storefront.
                    </p>
                    <Link
                        href="/shop"
                        className="mt-8 inline-flex rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-rose-600"
                    >
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
            <div className="overflow-hidden rounded-[2rem] border border-rose-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(255,245,247,0.92)_100%)] shadow-[0_24px_80px_-36px_rgba(190,24,93,0.4)]">
                <div className="border-b border-rose-200/70 bg-[radial-gradient(circle_at_top_left,rgba(251,207,232,0.5),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.98),rgba(255,241,242,0.94))] px-5 py-6 sm:px-8 sm:py-8">
                    {parent ? (
                        <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-y-2 text-sm text-slate-500">
                            {nameAndSlug.map((value, idx) => {
                                if (idx === 0)
                                    return (
                                        <Link key={idx} className="rounded-full bg-white/80 px-3 py-1.5 font-medium text-slate-600 transition-colors hover:text-rose-600" href={`/shop/${value[1]}`}>
                                            {value[0]}
                                        </Link>
                                    );
                                else
                                    return (
                                        <Fragment key={idx}>
                                            <span className="px-1 text-rose-300">{`>`}</span>
                                            <Link className="rounded-full bg-white/70 px-3 py-1.5 font-medium text-slate-600 transition-colors hover:text-rose-600" href={`/shop/${value[1]}`}>
                                                {`${value[0]}`}
                                            </Link>
                                        </Fragment>
                                    );
                            })}
                        </nav>
                    ) : (
                        <div className="mb-4">
                            <Link href="/shop" className="inline-flex rounded-full bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-rose-600">
                                All categories
                            </Link>
                        </div>
                    )}

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="max-w-3xl">
                            <p className="text-xs font-semibold tracking-[0.28em] text-rose-500 uppercase">Category page</p>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{currentCategory}</h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                                Browse everything currently listed under this category and jump into any product card for more detail.
                            </p>
                        </div>

                        <div className="inline-flex w-fit items-center rounded-full border border-rose-200 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                            {productCountLabel}
                        </div>
                    </div>
                </div>

                <div className="px-4 py-5 sm:px-6 sm:py-7">
                    <main className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        {products?.map((product: ProductSubset, idx: number) => (
                            <ProductCard key={idx} id={product.id} item={product.item} price={product.price} />
                        ))}
                    </main>
                </div>
            </div>
        </section>
    );
}

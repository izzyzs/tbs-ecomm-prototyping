import React, { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Product, ProductSubset } from "@/utils/types";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import Loading from "./loading";
// import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ categoryName: string }> }) {
    const supabase = await createClient();
    const { categoryName } = await params;
    const decodedName = decodeURIComponent(categoryName);
    // console.log("\nCategory name:", decodedName, "\n");
    const { data: products, error } = (await supabase.from("deez").select("id, item, price").ilike("category", decodedName)) as { data: ProductSubset[] | null; error: any };
    if (!products || products.length < 1)
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8">
                <h1 className="text-3xl font-bold mb-2">Category "{`${categoryName}`}" not found</h1>
                <p className="text-gray-600">The category you&#39;re looking for doesn&#39;t exist or may have been removed.</p>
                <Link href="/shop">
                    <div className="mt-4 p-3 rounded bg-gray-300 hover:bg-gray-700">Try Again</div>
                </Link>
            </div>
        );
    if (error) throw new Error(error.message);
    console.log(products);

    return (
        // <main className="flex flex-wrap">
        <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:gap-6 mx-auto pt-4 sm:p-8 rounded-sm sm:py-11 sm:px-12">
            {products?.map((product: ProductSubset, idx: number) => (
                <ProductCard key={idx} id={product.id} item={product.item} price={product.price} />
            ))}
        </main>
    );
}

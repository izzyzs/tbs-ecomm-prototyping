import React, { Fragment, Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Product } from "@/utils/types";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import Loading from "./loading";
import {PostgrestError} from "@supabase/supabase-js";
import {number} from "zod";

type ProductSubset = {id: number, item: string, price: number};

export default async function Page({ params }: { params: Promise<{ categoryName: string }> }) {
    const supabase = await createClient();
    const { categoryName } = await params;
    const decodedName = decodeURIComponent(categoryName);

    const {data , error: categoryIdError} = await supabase.from("categories").select("id, path").eq("slug", categoryName).single();
    if (!data) throw new Error(`${categoryName} not found`);
    if (categoryIdError) throw categoryIdError;
    const { id: categoryId, path } = data as { id: number, path: string };
    const { data: products, error } = (await supabase.from("inventory").select("id, item, price").eq("category_id", categoryId).eq("publish_to_ecom", true)) as { data: ProductSubset[] | null; error: PostgrestError };

    if (!products || products.length < 1)
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8">
                <h1 className="text-3xl font-bold mb-2">Category "{`${categoryName}`}" not found</h1>
                <p className="text-gray-600">The category you&#39;re looking for doesn&#39;t exist or may have been removed.</p>
                <Link href="/shop">
                    <div className="mt-4 p-3 rounded bg-gray-300 hover:bg-gray-700">Continue Shopping!</div>
                </Link>
            </div>
        );
    if (error) throw error;
    if (categoryIdError) throw categoryIdError;

    const pathArray: string[] = path.split(".");
    console.log("pathArray", pathArray);
    const nameAndSlug: [string, string][] = [];
    for (let i = 0; i < pathArray.length; i++) {
        const { data, error: parentNameError } = await supabase.from('categories').select('name').eq('slug', pathArray[i]).single();
        if (!data) throw new Error("category is missing");
        if (parentNameError) throw parentNameError;
        console.log("name", data.name);
        nameAndSlug.push([data.name, pathArray[i]]);
    }
    // console.log("path", path);
    // console.log("pathArray", pathArray);
    const parent = pathArray.length >= 2 ? pathArray[pathArray.length - 2] : undefined;
    // console.log("parent", parent);

    return (
        // <main className="flex flex-wrap">
        <>
            {parent && nameAndSlug.map((value, idx) => {
                if (idx === 0) return <Link key={idx} className={`hover:text-pink-500`} href={`/shop/${value[1]}`}>{value[0]}</Link>
                else return <Fragment key={idx}><span>{` > `}</span><Link className={`hover:text-pink-500`} href={`/shop/${value[1]}`}>{`${value[0]}`}</Link></Fragment>
            })}
            <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-6 mx-auto pt-4 sm:p-8 rounded-sm sm:py-11 sm:px-12">
                {products?.map((product: ProductSubset, idx: number) => (
                    <ProductCard key={idx} id={product.id} item={product.item} price={product.price} />
                ))}
            </main>
        </>
    );
}

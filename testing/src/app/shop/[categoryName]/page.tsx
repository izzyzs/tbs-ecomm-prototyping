import React from "react";
import { createClient } from "@/lib/supabase/server";
import { Product, ProductSubset } from "@/utils/types";
import ProductCard from "@/components/product/ProductCard";

export default async function Page({ params }: { params: Promise<{ categoryName: string }> }) {
    const supabase = await createClient();
    const { categoryName } = await params;
    const { data: products, error } = (await supabase.from("products").select("id, name, price").eq("category", categoryName)) as { data: ProductSubset[] | null; error: any };
    if (error) console.log(error);
    console.log(products);

    return (
        <main className="flex flex-wrap">
            {products?.map((product: ProductSubset, idx: number) => (
                <ProductCard key={idx} id={product.id} name={product.name} price={product.price} />
            ))}
        </main>
    );
}

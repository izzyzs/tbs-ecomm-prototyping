import React, { use } from "react";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { Product } from "@/utils/types";
import ProductView from "@/components/product/ProductView";

export default async function Page({ params }: { params: Promise<{ productId: string }> }) {
    const supabase = await createClient();
    const { productId } = await params;

    const { data, error } = (await supabase.from("inventory").select("*").eq("id", productId).limit(1).single()) as { data: Product | null; error: any };
    console.log({ data, error });
    if (error?.code === "PGRST116" || !data) return notFound(); // not found
    if (error) throw new Error(error.message);

    return <ProductView product={data} />;
}

import React from "react";
import { Briefcase, Users, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/utils/types";
import ShopNowButton from "@/components/home/ShopNowButton";
import {Database} from "@tbs/infra";
import Landing from "@/components/landing";

type GetRandomProductsReturnType = Database["public"]["Functions"]["get_random_products"]["Returns"][number];

const HomePage = async () => {
    const supabase = await createClient();

    const { data: products } = await supabase.rpc("get_active_products");

    return (
        <>
            {/*<Landing />*/}
            <div className={`p-3 text-center`}>
                <h1 className={`text-xl mx-auto w-1/2 mt-1 mb-6 `}>Welcome to <span className={`text-3xl font-bold `}>Today's Beauty Supply!</span></h1>
                <p className={`text-neutral-400 text-xl`}>Place an order for sameday pickup</p>
                <section className="py-16 px-6 bg-pink-50">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Available Products</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {products?.map((product: GetRandomProductsReturnType, idx: number) => (
                            <ProductCard id={product.id} item={product.item} price={`$${product.price_in_pennies!/100}`} key={idx} />
                        ))}
                    </div>
                </section>
            </div>

        </>
    );
};

export default HomePage;

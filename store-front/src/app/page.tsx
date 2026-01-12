import React from "react";
import { Briefcase, Users, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/utils/types";
import ShopNowButton from "@/components/home/ShopNowButton";

const HomePage = async () => {
    const supabase = await createClient();

    const { data: products } = await supabase.rpc("get_random_products", {
        limit_count: 4,
    });

    return (
        <>
            {/* Hero section highlighting the store's mission */}
            <section className="relative bg-gradient-to-r from-pink-100 via-rose-50 to-orange-50 py-20 px-6 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Beauty Favorites, Delivered When You Need Them</h1>
                <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-700 mb-6">
                    Stock up on hair, skin, and wellness staples for every routine—with same-day and next-day delivery that keeps your glow on schedule.
                </p>
                <ShopNowButton />
            </section>

            {/* Professional benefits section */}
            <section className="py-16 px-6 bg-white">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Why Shop With TBS Beauty Supply</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <div className="flex flex-col items-center p-6 border rounded-lg">
                        <Briefcase className="h-10 w-10 text-pink-500 mb-3" />
                        <h3 className="font-semibold mb-1">Fast Local Delivery</h3>
                        <p className="text-sm text-center text-gray-600">Same-day and next-day options keep your shelves stocked without the wait.</p>
                    </div>
                    <div className="flex flex-col items-center p-6 border rounded-lg">
                        <Users className="h-10 w-10 text-pink-500 mb-3" />
                        <h3 className="font-semibold mb-1">Trusted Brands</h3>
                        <p className="text-sm text-center text-gray-600">Find everyday essentials and pro-grade heroes in one convenient destination.</p>
                    </div>
                    <div className="flex flex-col items-center p-6 border rounded-lg">
                        <Star className="h-10 w-10 text-pink-500 mb-3" />
                        <h3 className="font-semibold mb-1">Perks for Pros</h3>
                        <p className="text-sm text-center text-gray-600">Unlock wholesale pricing and exclusive rewards when your salon partners with us.</p>
                    </div>
                </div>
            </section>

            {/* Example product grid */}
            <section className="py-16 px-6 bg-pink-50">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Featured Products</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {products?.map((product: Product, idx: number) => (
                        <ProductCard id={product.id} item={product.item} price={product.price} key={idx} />
                    ))}
                </div>
            </section>
        </>
    );
};

export default HomePage;

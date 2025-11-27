import { Product } from "@/utils/types";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { UserResponse } from "@supabase/supabase-js";
import AddToCartButton from "@/components/product/AddToCartButton";

type ProductViewProps = { product: Product };

export default function ProductView({ product }: ProductViewProps) {
    return (
        <>
            <section className="py-16 px-6 bg-pink-50">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="h-80 bg-gray-100 rounded-lg" />
                    <div className="flex flex-col justify-center space-y-4">
                        <h1 className="text-3xl font-bold">{`${product.item}`}</h1>
                        <div className="flex items-center space-x-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} fill="#f6339a" className="h-5 w-5 text-pink-500" />
                            ))}
                        </div>
                        <p className="text-gray-700">This product is loved by professionals for its quality and results. It fits perfectly into your daily beauty routine.</p>
                        <p className="text-xl font-semibold">{`${product.price}`}</p>
                        <AddToCartButton productId={product.id} />
                    </div>
                </div>
            </section>
        </>
    );
}

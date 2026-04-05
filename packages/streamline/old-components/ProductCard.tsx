import React from "react";
import { Button } from "@/components/my-button";
import Link from "next/link";
// import { Product, ProductSubset } from "@/utils/types";
import AddToCartButton from "@/components/product/AddToCartButton";
import SeeMoreButton from "@/components/product/SeeMoreButton";

type ProductSubset = { id: number, item: string, price: number };

export default function ProductCard({ id, item: name, price }: ProductSubset) {
    return (
        <div className="group relative border rounded-lg p-4 flex flex-col items-center bg-white shadow-sm hover:shadow-md transition-shadow">
            <Link href={`/product/${id}`} className="absolute inset-0 z-0" aria-label={`View details for ${name}`}>
                <span className="sr-only">View {name}</span>
            </Link>

            <div className="relative z-10 pointer-events-none">
                <div className="h-40 w-full bg-gray-100 mb-4" />
                <h3 className="font-semibold text-center mb-1">{name}</h3>
                <p className="text-sm text-gray-600 text-center">{price}</p>
            </div>

            <div className="relative z-10 flex flex-col gap-2 mt-4">
                <SeeMoreButton size="sm" variant="secondary" className="mt-2" productId={id}>
                    See More
                </SeeMoreButton>
                <AddToCartButton size="sm" className="mt-2" productId={id}>
                    Add to Cart
                </AddToCartButton>
            </div>

            <div className="absolute inset-0 border-2 border-transparent group-hover:border-pink-500 rounded-lg transition-colors pointer-events-none z-20" />
        </div>
    );
}

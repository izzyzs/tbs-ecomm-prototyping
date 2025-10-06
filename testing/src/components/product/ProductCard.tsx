import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Product, ProductSubset } from "@/utils/types";

export default function ProductCard({ id, name, price }: ProductSubset) {
    return (
        <Link href={`/product/${id}`}>
            <div className="border rounded-lg p-4 flex flex-col items-center bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="h-40 w-full bg-gray-100 mb-4" />
                <h3 className="font-semibold text-center mb-1">{name}</h3>
                <p className="text-sm text-gray-600 text-center">${price}</p>
                <Button size="sm" variant={"secondary"} className="mt-2">
                    See More
                </Button>
                <Button size="sm" className="mt-2">
                    Add to Cart
                </Button>
            </div>
        </Link>
    );
}

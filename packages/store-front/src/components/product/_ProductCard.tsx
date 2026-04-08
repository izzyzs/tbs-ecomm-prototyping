"use client";
// import { ProductSubset } from "@/utils/types";
import React from "react";

type ProductSubset = { id: number, name: string | null, price: string | null };

export default function ProductCard({ id, name, price }: ProductSubset) {
    // TODO: make this look nice and add product showing functionality
    return (
        <div className="p-5">
            <p>id: {id}</p>
            <p>name: {name}</p>
            <p>price: ${price}</p>
        </div>
    );
}

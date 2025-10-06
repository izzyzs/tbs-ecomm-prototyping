"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import NavBar from "@/components/nav/NavBar";
import { Product } from "@/utils/types";

interface ProductPageProps {
    productData: any;
}
/**
 * A simple product page demonstrating the same aesthetic as the home page.
 *
 * It uses Shadcn UI components with Tailwind CSS and TypeScript. The page
 * includes a navigation bar, product details section, and a modal for adding
 * the product to the cart.
 */
export default function Page({ productData }: ProductPageProps) {
    const [open, setOpen] = React.useState(false);

    const product: Product = {
        id: 1,
        name: "hey",
        description: "Model Product",
        barcode: "000000001",
        category: "Category",
        price: 135.24,
        inventory: 3,
        created_at: "2025-08-01T20:42:00Z",
        updated_at: "2025-08-01T20:42:00Z",
    };

    return (
        <>
            {/* Product details section */}
            <section className="py-16 px-6 bg-pink-50">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="h-80 bg-gray-100 rounded-lg" />
                    <div className="flex flex-col justify-center space-y-4">
                        <h1 className="text-3xl font-bold">{`${product.description}`}</h1>
                        <div className="flex items-center space-x-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} fill="#f6339a" className="h-5 w-5 text-pink-500" />
                            ))}
                        </div>
                        <p className="text-gray-700">This product is loved by professionals for its quality and results. It fits perfectly into your daily beauty routine.</p>
                        <p className="text-xl font-semibold">{`$${product.price}`}</p>
                        <Button onClick={() => setOpen(true)}>Add to Cart</Button>
                    </div>
                </div>
            </section>

            {/* Add to cart modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add to Cart</DialogTitle>
                        <DialogDescription>Enter your email to add this product to your cart.</DialogDescription>
                    </DialogHeader>
                    <form className="mt-4 space-y-3">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="name@example.com" />
                        </div>
                        <DialogFooter>
                            <Button type="submit" className="w-full">
                                Confirm
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

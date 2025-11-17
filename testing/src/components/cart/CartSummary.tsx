// system_id, upc, ean, custom_sku, manufact_sku, item, vendor_id, qty, price, tax, brand, publish_to_ecom, season, department, msrp, tax_class, default_cost, vendor, category, subcategory, subcategory_2,subcategory_3, subcategory_4, subcategory_5, subcategory_6, subcategory_7, subcategory_8, subcategory_9
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Package, Truck, Trash2, Plus, Minus } from "lucide-react";
import { formatCurrency } from "@/utils/helper-functions";
import { useAuth } from "@/context/AuthContext";

const CartSummary = () => {
    const { list, add, decrement, remove } = useCart();
    const { userId } = useAuth();

    return (
        <div className="bg-white border border-rose-100 rounded-xl shadow-sm">
            <div className="flex items-center justify-between border-b border-rose-100 px-6 py-5">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Cart Summary</h2>
                    <p className="text-sm text-gray-500">Curated for pro-level results in every service.</p>
                </div>
                <span className="text-sm text-gray-500">{list().length} items</span>
            </div>

            <div className="space-y-6 px-6 py-6">
                {list().map((item) => (
                    <div key={item.id} className="space-y-4 border-b border-gray-100 pb-6 last:border-none last:pb-0">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                            <div className="relative h-32 w-full rounded-lg bg-gradient-to-tr from-pink-50 to-orange-100 sm:h-32 sm:w-32 flex items-center justify-center">
                                <Package className="h-10 w-10 text-pink-500" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        {item.id}
                                        <h3 className="text-lg font-semibold text-gray-900">{item.brand}</h3>
                                        <p className="text-sm text-gray-600">{item.name}</p>
                                    </div>
                                    <p className="text-base font-semibold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                                    {/* <p className="text-base font-semibold text-gray-900">{formatCurrency(item.price)}</p> */}
                                </div>
                                {/* <p className="mt-2 text-sm text-gray-500">{item.description}</p> */}
                                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                    {/* <span className="rounded-full bg-pink-50 px-3 py-1 text-pink-600">{item.size}</span> */}
                                    <span>
                                        <Button
                                            onClick={() => decrement(item.id)}
                                            variant="ghost"
                                            className="text-pink-400 hover:text-pink-400 border-[1px] border-transparent hover:border-pink-400 hover:bg-transparent"
                                        >
                                            <Minus />
                                        </Button>
                                    </span>
                                    <span>Qty {item.quantity}</span>
                                    <span>
                                        <Button
                                            onClick={() => add(item.id, userId)}
                                            variant="ghost"
                                            className="text-pink-400 hover:text-pink-400 border-[1px] border-transparent hover:border-pink-400 hover:bg-transparent"
                                        >
                                            <Plus />
                                        </Button>
                                    </span>
                                    <span className="text-pink-500 font-medium">{formatCurrency(item.price)} each</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-500">
                                <Truck className="h-4 w-4 text-pink-500" />
                                Ships in 1-2 business days
                            </div>
                            <Button onClick={() => remove(item.id)} variant="ghost" size="sm" className="text-gray-600 hover:text-rose-600">
                                <Trash2 className="h-4 w-4" />
                                Remove
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CartSummary;

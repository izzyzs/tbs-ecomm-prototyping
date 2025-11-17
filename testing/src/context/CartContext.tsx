"use client";
import { createContext, useRef, useContext, useState } from "react";
import { Cart, CartItem } from "@/utils/types";
import { createClient } from "@/lib/supabase/client";

// number represents a product's id
type CartItemObj = Record<number, CartItem>;

/*
type CartItemObj = Record<number, CartItem>;




*/
export interface CartContextType {
    cartItemObjects: CartItemObj;

    // Mutative functions

    add: (productId: number, userId: string | undefined) => Promise<void>;
    remove: (productId: number, userId: string | undefined) => void;
    decrement: (productId: number, userId: string | undefined) => void;

    // Read only selectors

    getById: (productId: number) => CartItem | undefined;
    list: () => CartItem[]; // TODO: reflect on whether or not this is needed; most likely yes.
    count: () => number;
    subtotal: () => number;
    qualifiesForFreeShipping: () => boolean;
    remainingForFreeShipping: () => number;
    shipping: () => number;
    tax: () => number;
    orderTotal: () => number;

    // db reading selectors
    retrieveCartItems: (cartId: number) => CartItem[];
}

const CartContext = createContext<CartContextType | null>(null);

export default function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItemObj>({});
    const cartIdRef = useRef<number | null>(null);

    const supabase = createClient();

    async function ensureCart(userId: string): Promise<number> {
        if (cartIdRef.current) return cartIdRef.current;

        const { data: cartId, error: ensureCartError } = await supabase.rpc("ensure_cart", { user_id: userId });

        if (ensureCartError) {
            console.error("CartContext.ensureCart error");
            throw ensureCartError;
        }

        cartIdRef.current = cartId;
        return cartId;
    }

    const createCartItemFromDb = async (productId: number) => {
        // TODO: REMOVE DEBUGGING LOGS BELOW
        const { data, error } = await supabase.from("inventory_11102025").select("id, item, brand, price, tax").eq("id", productId).limit(1).single();
        if (error) {
            console.log("CartContext.createCartItemFromDb select cart item from inventory error");
            throw error;
        }

        if (data) console.log("DATA RETURNED FOR createCartItemFromDb QUERY", data);

        return {
            productId: data.id,
            name: data.item,
            brand: data.brand,
            price: +data.price.replace("$", ""),
            quantity: 0,
        } as CartItem;
    };

    const retrieveCartItems = async (cartId: number) => {
        const { data, error } = await supabase.from("test_cart_items").select("*");
    };

    const getCartItem = async (productId: number) => {
        // TODO: REMOVE DEBUGGING LOGS BELOW
        if (productId in cartItems) {
            return cartItems[productId];
        }
        console.log("getCartItem debugging");

        return await createCartItemFromDb(productId);
    };

    async function add(productId: number, userId: string | undefined) {
        // TODO: REMOVE DEBUGGING LOGS BELOW
        const cartItem = await getCartItem(productId);
        cartItem.quantity++;
        const newCartItems = { ...cartItems, [cartItem.productId]: cartItem };
        setCartItems(newCartItems);

        if (userId) {
            if (!cartIdRef.current) cartIdRef.current = await ensureCart(userId);

            const { data, error } = await supabase.rpc("add_cart_item", { p_cart_id: cartIdRef.current, p_product_id: cartItem.productId, p_quantity: cartItem.quantity });
            if (error) {
                console.error("CartContext.add error");
                throw error;
            }
            // TODO: remove debugging logging
            if (data) console.log("data added to postgres", data);
            return;
        }
        const cartItemsAsString = JSON.stringify(newCartItems);
        localStorage.setItem("cart", cartItemsAsString);
    }

    async function remove(productId: number, userId: string | undefined) {
        // TODO: REMOVE DEBUGGING LOGS BELOW
        const prev = cartItems;
        const { [productId]: item, ...rest } = prev;
        setCartItems(rest);
        console.log("product removed from cartItems Object");
        console.log(item);

        if (userId) {
            const { data, error } = await supabase.from("test_cart_items").delete().eq("cart_id", cartIdRef.current).eq("product_id", productId).select();
            if (error) {
                console.error("ERROR: CartContext.remove() supabase delete error");
                console.error(error);
                throw error;
            }
            console.log(`user removed this product:\nProduct id:\t${productId}\n${data}`);
            return;
        }

        const newCartString = JSON.stringify(rest);
        localStorage.setItem("cart", newCartString);
    }

    async function decrement(productId: number, userId: string | undefined) {
        let updatedCart: CartItemObj;
        const prev = cartItems;
        const item = prev[productId];
        if (!item) updatedCart = prev;

        const updatedItem = { ...item, quantity: item.quantity - 1 };

        if (updatedItem.quantity <= 0) {
            const { [productId]: _, ...rest } = prev;
            return rest;
        }

        updatedCart = { ...prev, [productId]: updatedItem };
        setCartItems(updatedCart);
    }

    // the CartProvider.add() handles this functionality, thus, it is no longer needed
    // function increment(productId: number) {
    //     setCartItems((prev) => {
    //         const item = prev[productId];
    //         if (!item) {
    //             return prev;
    //         }

    //         const updatedItem = { ...item, quantity: item.quantity + 1 };
    //         return { ...prev, [productId]: updatedItem };
    //     });
    // }

    const getById = (productId: number) => cartItems[productId];

    const list = () => Object.values(cartItems);

    const count = () => {
        let count = 0;
        Object.values(cartItems).forEach((item) => {
            count += item.quantity;
        });
        return count;
    };

    const subtotal = () => {
        let sTotal = 0;
        Object.values(cartItems).forEach((item) => {
            sTotal += item.price * item.quantity;
        });
        return sTotal;
    };

    const freeShippingThreshold = () => 125;
    const qualifiesForFreeShipping = () => subtotal() >= freeShippingThreshold();
    const remainingForFreeShipping = () => Math.max(freeShippingThreshold() - subtotal(), 0);
    // TODO: implement shipping calculation
    const shipping = () => (qualifiesForFreeShipping() ? 0 : 9.99);

    const tax = () => Math.round(subtotal() * 0.0825 * 100) / 100;
    const orderTotal = () => Math.round((subtotal() + shipping() + tax()) * 100) / 100;

    /*
    TODO: create retrieveCartItems, it's goal is to retrieve items already 
    in the db based on cartId
    
    Property 'retrieveCartItems' is missing in type '{ cartItemObjects: CartItemObj; add: (productId: number, userId: string | undefined) => Promise<void>; remove: (id: number) => void; decrement: (id: number) => void; ... 9 more ...; orderTotal: () => number; }' but required in type 'CartContextType'.ts(2741)
    */

    const cart: CartContextType = {
        cartItemObjects: cartItems,
        add,
        remove,
        decrement,
        getById,
        list,
        count,
        subtotal,
        qualifiesForFreeShipping,
        remainingForFreeShipping,
        shipping,
        tax,
        orderTotal,
    };

    return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within a CartProvider instance");
    return ctx;
}

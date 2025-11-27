"use client";
import { createContext, useRef, useContext, useState, useEffect } from "react";
import { Cart, CartItem } from "@/utils/types";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

// number represents the item's productId for retrieval by productId
type CartItemObj = Record<number, CartItem>;

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
}

const CartContext = createContext<CartContextType | null>(null);

export default function CartProvider({ children }: { children: React.ReactNode }) {
    // The cart's information is stored in the following object
    const [cartItems, setCartItems] = useState<CartItemObj>({});
    const { userId, authLoading } = useAuth();
    const previousUserIdRef = useRef(userId);

    let num = 0;
    useEffect(() => {
        console.log(`userId print ${++num}\t${userId}`);
        async function initCartAfterLogin() {
            if (userId) {
                const uid = userId;

                if (previousUserIdRef.current === undefined) {
                    syncLocalCartWithDB(uid);
                    previousUserIdRef.current = userId;
                }

                const dbCart = await retrieveCartItems(userId);
                setCartItems(dbCart);
            } else {
                if (previousUserIdRef.current) {
                    setCartItems({});
                    previousUserIdRef.current = userId;
                }
            }
        }
        initCartAfterLogin();
    }, [userId]);

    const retrieveCartItems = async (userId: string): Promise<CartItemObj> => {
        console.log("retrieveCartItems");
        const { data, error } = await supabase.rpc("retrieve_cart_items_to_front", { p_user_id: userId });
        if (error) {
            console.error("retrieveCartItems error");
            console.error(error);
        }
        if (!data) {
            return {} as CartItemObj;
        }
        console.log("RETRIEVE CART ITEMS DATA", data);
        return data;
    };

    const syncLocalCartWithDB = async (userId: string) => {
        const cartId = await ensureCart(userId);
        const localCart = localStorage.getItem("cart");
        if (!localCart) return;

        const localCartArrayString = JSON.stringify(Object.values(JSON.parse(localCart)));
        const { data, error } = await supabase.rpc("sync_local_cart_to_db", { p_cart_id: cartId, p_local_cart: localCartArrayString });
        if (error) {
            console.error("CartProvider.syncLocalCartWithDB() error");
            console.error(error);
        }
        localStorage.setItem("cart", "");
    };

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
        const newCartItem = { ...cartItem, quantity: cartItem.quantity + 1 };
        const newCartItems = { ...cartItems, [newCartItem.productId]: newCartItem };
        setCartItems(newCartItems);

        if (userId) {
            if (!cartIdRef.current) cartIdRef.current = await ensureCart(userId);

            const { data, error } = await supabase.rpc("add_cart_item", { p_cart_id: cartIdRef.current, p_product_id: newCartItem.productId, p_quantity: newCartItem.quantity });
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
            if (!cartIdRef.current) cartIdRef.current = await ensureCart(userId);

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
        console.log("starting decrement debug");
        const prev = cartItems;
        console.log("prev", prev);
        console.log("productId", productId);
        const item = prev[productId];

        if (item.quantity == 1) {
            console.log("item.quantity", item.quantity);
            remove(productId, userId);
            return;
        }

        const updatedItem = { ...item, quantity: item.quantity - 1 };
        const newCartItems = { ...prev, [updatedItem.productId]: updatedItem };
        setCartItems(newCartItems);

        if (userId) {
            const { data, error } = await supabase.from("test_cart_items").update({ quantity: updatedItem.quantity }).eq("cart_id", cartIdRef.current).eq("product_id", productId).select();

            if (error) {
                console.error("ERROR: CartContext.decrement() supabase update error");
                console.error(error);
                throw error;
            }
            console.log(`user updated this product:\nProduct id:\t${productId}\n${data}`);
            return;
        }

        const newCartString = JSON.stringify(newCartItems);
        localStorage.setItem("cart", newCartString);
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
        if (cartItems) {
            Object.values(cartItems).forEach((item) => {
                count += item.quantity;
            });
        }
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

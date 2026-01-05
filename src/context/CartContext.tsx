"use client";
import { createContext, useRef, useContext, useState, useEffect } from "react";
import { Cart as OldCart, CartItemState, SubmissionResponse } from "@/utils/types";
import { Cart } from "@/domain/cart/cart";
import { CartItem, CartItemDraft } from "@/domain/cart/cart-item.domain";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

import { CartId, CartOwner, ProductId, UserId } from "@/domain/identity";
import GetCartItem from "@/usecases/cart/GetCartItem";
import { SupabaseCartRepository } from "@/infrastructure/SupabaseCartRepository";
import { LocalStorageCartRepository } from "@/infrastructure/LocalStorageCartRepository";
import CartMapper from "@/interface-adapters/mappers/cart-item.mapper";

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
    // list: () => CartItem[]; // TODO: reflect on whether or not this is needed; most likely yes.
    list: CartItem[]; // TODO: reflect on whether or not this is needed; most likely yes.
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
    const [cartItems, setCartItems] = useState<CartItemState[]>([]);
    const { userId, authLoading } = useAuth();
    const previousUserIdRef = useRef(userId);
    const cartIdRef = useRef<CartId | null>(null);
    const supabase = createClient();

    const supabaseCartRepository = new SupabaseCartRepository(supabase);
    const localStorageCartRepository = new LocalStorageCartRepository();

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

                const dbCart = await supabaseCartRepository.retrieveCartItems(userId);
                const dbState = dbCart.map((item) => CartMapper.toStateFromDomain(item));
                setCartItems(dbState);
            } else {
                if (previousUserIdRef.current) {
                    setCartItems([]);
                    previousUserIdRef.current = userId;
                }
            }
        }
        initCartAfterLogin();
    }, [userId]);

    const syncLocalCartWithDB = async (userId: UserId) => {
        const cartId = await retrieveCartId(userId);
        const localCart = localStorage.getItem("cart");
        if (!localCart) return;

        const localCartArrayString = JSON.stringify(Object.values(JSON.parse(localCart)));
        supabaseCartRepository.syncLocalCartWithDB(cartId, localCartArrayString);
        localStorage.setItem("cart", "");
    };

    async function retrieveCartId(userId: UserId): Promise<CartId> {
        if (cartIdRef.current) return cartIdRef.current;

        const cartId = await supabaseCartRepository.ensureCart(userId);

        cartIdRef.current = cartId;
        return cartId;
    }

    const createCartItemFromDb = async (productId: number) => {
        // TODO: REMOVE DEBUGGING LOGS BELOW
        const { data, error } = await supabase.from("inventory").select("id, item, brand, price, tax").eq("id", productId).limit(1).single();
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
        } as CartItemState;
    };

    const getCartItem = async (productId: number) => {
        // TODO: REMOVE DEBUGGING LOGS BELOW
        if (productId in cartItems) {
            return cartItems[productId];
        }
        console.log("getCartItem debugging");

        const item = await supabaseCartRepository.createCartItemDraft(new ProductId(productId));
        return item;
    };

    async function add(productId: ProductId, userIdString?: string): SubmissionResponse {
        // TODO: REMOVE DEBUGGING LOGS BELOW
        const getCartItem = new GetCartItem(supabaseCartRepository);
        let cartItemDraft: CartItemDraft;
        try {
            cartItemDraft = await getCartItem.execute(productId);
        } catch (e) {
            console.error("Couldn't create cart item:", e);
            return { msg: `Couldn't create cart item: ${e}.`, isError: true };
        }

        if (!cartItemDraft) {
            return { msg: `Cart creation error`, isError: true };
        }

        let newCartItem: CartItemState;
        let newCartItems: CartItemState[];
        let owner: CartOwner;

        if (userIdString) {
            const userId = new UserId(userIdString);
            const cartId = await retrieveCartId(userId);
            owner = { kind: "Authenticated", userId, cartId };
        } else {
            owner = { kind: "Guest" };
        }
        const itemAdded = await supabaseCartRepository.addCartItem(cartId, cartItemDraft);
        newCartItem = CartMapper.toStateFromDomain(itemAdded);
        newCartItems = [...cartItems, newCartItem];
        setCartItems(newCartItems);
        return { msg: `Item successfully added`, isError: false };

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

            const { data, error } = await supabase.from("cart_items").delete().eq("cart_id", cartIdRef.current).eq("product_id", productId).select();
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
            const { data, error } = await supabase.from("cart_items").update({ quantity: updatedItem.quantity }).eq("cart_id", cartIdRef.current).eq("product_id", productId).select();

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

    const list = Object.values(cartItems);

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

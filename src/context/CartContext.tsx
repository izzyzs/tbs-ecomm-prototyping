"use client";
import React, { createContext, useRef, useContext, useState, useEffect } from "react";
import { Cart as OldCart, CartItemState, SubmissionResponse } from "@/utils/types";
import { Cart } from "@/domain/cart/cart";
import { CartItem, CartItemDraft } from "@/domain/cart/cart-item";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

import { CartId, CartOwner, ProductId, UserId } from "@/domain/identity";
import GetCartItem from "@/usecases/cart/GetCartItem";
import { SupabaseCartRepository } from "@/infrastructure/cart/SupabaseCartRepository";
import { LocalStorageCartRepository } from "@/infrastructure/cart/LocalStorageCartRepository";
import CartMapper from "@/interface-adapters/mappers/cart-item.mapper";
import { Database } from "@/lib/supabase/database.types";
import UserMapper from "@/interface-adapters/mappers/user.mapper";
import { DefaultCartGateway } from "@/infrastructure/cart/CartGateway";
import { AddItemToCart } from "@/usecases/cart/AddItemToCart";
import { ProductIdMapper } from "@/interface-adapters/mappers/identity.mapper";

// number represents the item's productId for retrieval by productId
// type CartItemObj = Record<number, CartItem>; <== decided on use of an array due to

export interface CartContextType {
    cartItems: CartItemState[];

    // Mutative functions

    add: (productIdNumber: number) => Promise<SubmissionResponse>;
    remove: (productId: number, userId: string | undefined) => void;
    decrement: (productId: number, userId: string | undefined) => void;

    // Read only selectors

    // getById: (productId: number) => CartItem | undefined;
    // list: () => CartItem[]; // TODO: reflect on whether or not this is needed; most likely yes.

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
    const { user, authLoading } = useAuth();
    const previousUserRef = useRef(user);
    const cartIdRef = useRef<CartId | null>(null);
    const supabase = createClient();
    const supabaseCartRepository = new SupabaseCartRepository(supabase);
    const localStorageCartRepository = new LocalStorageCartRepository();

    const userId = React.useMemo(() => user?.id, [user]);

    let num = 0;
    useEffect(() => {
        console.log(`userId print ${++num}\t${userId}`);
        async function initCartAfterLogin() {
            if (user) {
                if (previousUserRef.current === undefined) {
                    syncLocalCartWithDB(UserMapper.toDomainFromState(user).id);
                    previousUserRef.current = user;
                }
                const cartId = await supabaseCartRepository.ensureCart(UserMapper.toDomainFromState(user).id);
                const dbCart = await supabaseCartRepository.retrieveCartItems(cartId);
                const dbState = dbCart.map((item) => CartMapper.toStateFromDomain(item));
                setCartItems(dbState);
            } else {
                if (previousUserRef.current) {
                    setCartItems([]);
                    previousUserRef.current = user;
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

    // const createCartItemFromDb = async (productId: number) => {
    //     // TODO: REMOVE DEBUGGING LOGS BELOW
    //     const { data, error } = await supabase.from("inventory").select("id, item, brand, price, tax").eq("id", productId).limit(1).single();
    //     if (error) {
    //         console.log("CartContext.createCartItemFromDb select cart item from inventory error");
    //         throw error;
    //     }

    //     if (data) console.log("DATA RETURNED FOR createCartItemFromDb QUERY", data);

    //     return {
    //         productId: data.id,
    //         name: data.item,
    //         brand: data.brand,
    //         price: +data.price.replace("$", ""),
    //         quantity: 0,
    //     } as CartItemState;
    // };

    // const getCartItem = async (productId: number) => {
    //     // TODO: REMOVE DEBUGGING LOGS BELOW
    //     if (productId in cartItems) {
    //         return cartItems[productId];
    //     }
    //     console.log("getCartItem debugging");

    //     const item = await supabaseCartRepository.createCartItemDraft(new ProductId(productId));
    //     return item;
    // };

    async function add(productIdNumber: number): Promise<SubmissionResponse> {
        // TODO: REMOVE DEBUGGING LOGS BELOW
        // TODO: transfer this into add item to cart use case
        const getCartItem = new GetCartItem(supabaseCartRepository);
        const cartGateway = new DefaultCartGateway(localStorageCartRepository, supabaseCartRepository);
        const addItemToCart = new AddItemToCart(getCartItem, cartGateway);
        const productId = ProductIdMapper.toDomainFromState(productIdNumber);

        let owner: CartOwner;
        let itemAdded: CartItem;

        if (userId) {
            const uId = new UserId(userId);
            const cartId = await retrieveCartId(uId);
            owner = { kind: "Authenticated", userId: uId, cartId };
        } else {
            owner = { kind: "Guest" };
        }

        try {
            itemAdded = await addItemToCart.execute(productId, owner);
        } catch (e) {
            if (e instanceof Error) {
                // console.error("Couldn't create cart item:", e.message);
                return { msg: `Couldn't create cart item: ${e.message}.`, isError: true };
            }
            return { msg: `Couldn't create cart item: ${e}.`, isError: true };
        }

        const newCartItem = CartMapper.toStateFromDomain(itemAdded);
        const newCartItems = [...cartItems, newCartItem];
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

        if (user) {
            if (!cartIdRef.current) cartIdRef.current = await supabaseCartRepository.ensureCart(UserMapper.toDomainFromState(user).id);

            const { data, error } = await supabase.from("cart_items").delete().eq("cart_id", cartIdRef.current.number).eq("product_id", productId).select();
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

        if (user) {
            if (!cartIdRef.current) cartIdRef.current = await supabaseCartRepository.ensureCart(UserMapper.toDomainFromState(user).id);
            const { data, error } = await supabase.from("cart_items").update({ quantity: updatedItem.quantity }).eq("cart_id", cartIdRef.current?.number).eq("product_id", productId).select();

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
        cartItems,
        add,
        remove,
        decrement,
        // getById,
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

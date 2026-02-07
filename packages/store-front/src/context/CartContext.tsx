"use client";
import React, { createContext, useRef, useContext, useState, useEffect } from "react";
import { Cart as OldCart, SubmissionResponse } from "@/utils/types";
import { CartItemState } from "@tbs/view-models"
import {
    Cart,
    CartItem,
    CartItemDraft,
    CartId,
    CartItemId,
    CartOwner,
    ProductId,
    UserId, LocalCartStorageDTO
} from "@tbs/core";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import {
    SupabaseCartRepository,
    LocalStorageCartRepository,
    SupabaseInventoryRepository,
    DefaultCartGateway } from "@tbs/infra";
import { Database } from "@tbs/infra";
import { UserStateMapper, CartItemStateMapper } from "@tbs/view-models";
import { AddOrIncrementCartItem } from "@/usecases/cart/AddOrIncrementCartItem";
import { ProductIdMapper } from "@tbs/adapters";
import { CreateCartItemDraft } from "@/usecases/cart/CreateCartItemDraft";
import GetCartItemDraft from "@/usecases/cart/GetCartItemDraft";
import { DecrementItemInCart } from "@/usecases/cart/DecrementItemInCart";

// number represents the item's productId for retrieval by productId
// type CartItemObj = Record<number, CartItem>; <== decided on use of an array due to

export interface CartContextType {
    cartItems: CartItemState[];

    // Mutative functions

    add: (productIdNumber: number) => Promise<SubmissionResponse>;
    remove: (productIdNumber: number) => Promise<SubmissionResponse>;
    decrement: (cartItemIdNumber: number) => Promise<SubmissionResponse>;

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
    const supabaseInventoryRepository = new SupabaseInventoryRepository(supabase);
    const supabaseCartRepository = new SupabaseCartRepository(supabase);
    const localStorageCartRepository = new LocalStorageCartRepository();
    const cartGateway = new DefaultCartGateway(localStorageCartRepository, supabaseCartRepository);

    const userId = React.useMemo(() => user?.id, [user]);

    let num = 0;
    useEffect(() => {
        async function initCartAfterLogin() {
            if (user) {
                if (previousUserRef.current === undefined) {
                    await syncLocalCartWithDB(UserStateMapper.toDomainFromState(user).id);
                    const items = await localStorageCartRepository.retrieveCartItems();
                    previousUserRef.current = user;
                }
                const cartId = await supabaseCartRepository.ensureCart(UserStateMapper.toDomainFromState(user).id);
                const dbCart = await supabaseCartRepository.retrieveCartItems(cartId);
                const dbState = dbCart.map((item) => CartItemStateMapper.toStateFromDomain(item));
                setCartItems(dbState);
            } else {
                const itemsDTO = await localStorageCartRepository.retrieveCartItems();
                setCartItems(itemsDTO.map((item) => CartItemStateMapper.toStateFromDomain(item)));
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

        const localCartArray: LocalCartStorageDTO[] = JSON.parse(localCart);
        console.log("localCart", localCart);
        await supabaseCartRepository.syncLocalCartWithDB(cartId, localCartArray);
        localStorage.setItem("cart", "");
    };

    async function retrieveCartId(userId: UserId): Promise<CartId> {
        if (cartIdRef.current) return cartIdRef.current;

        const cartId = await supabaseCartRepository.ensureCart(userId);

        cartIdRef.current = cartId;
        return cartId;
    }

    async function add(productIdNumber: number): Promise<SubmissionResponse> {
        // TODO: REMOVE DEBUGGING LOGS BELOW
        // TODO: transfer this into add item to cart use case
        const createCartItemDraft = new CreateCartItemDraft(supabaseInventoryRepository);
        const getCartItemDraft = new GetCartItemDraft(cartGateway, createCartItemDraft);
        const addOrIncrementItemToCart = new AddOrIncrementCartItem(getCartItemDraft, cartGateway);
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


        itemAdded = await addOrIncrementItemToCart.execute(productId, owner);
        const newCartItem = CartItemStateMapper.toStateFromDomain(itemAdded);
        setCartItems((prev) => {
            let found = false;

            const next = prev.map((i) => {
                // console.log("i.productId", i.productId);
                // console.log("newCartItem.productId", newCartItem.productId);
                if (i.productId !== newCartItem.productId) return i;
                found = true;
                return newCartItem;
            });

            const newItems = found ? next : [...prev, newCartItem];
            console.log("new items", newItems);
            return newItems;
        });
        return { msg: `Item successfully added`, isError: false };
    }

    async function remove(productIdNumber: number): Promise<SubmissionResponse> {
        // TODO: REMOVE DEBUGGING LOGS BELOW
        setCartItems((prev) => prev.filter((i) => i.productId !== productIdNumber));

        let owner: CartOwner;
        const productId = new ProductId(productIdNumber);

        if (userId) {
            const uId = new UserId(userId);
            const cartId = await retrieveCartId(uId);
            owner = { kind: "Authenticated", userId: uId, cartId };
        } else {
            owner = { kind: "Guest" };
        }

        try {
            await cartGateway.removeCartItem(productId, owner);
        } catch (e) {
            if (e instanceof Error) {
                // console.error("Couldn't create cart item:", e.message);
                return { msg: `Couldn't remove cart item: ${e.message}.`, isError: true };
            }
            return { msg: `Couldn't remove cart item: ${e}.`, isError: true };
        }
        return { msg: `Item successfully removed`, isError: false };
    }

    async function decrement(productIdNumber: number): Promise<SubmissionResponse> {
        let owner: CartOwner;
        const productId = new ProductId(productIdNumber);

        if (userId) {
            const uId = new UserId(userId);
            const cartId = await retrieveCartId(uId);
            owner = { kind: "Authenticated", userId: uId, cartId };
        } else {
            owner = { kind: "Guest" };
        }

        const decrementItemInCart = new DecrementItemInCart(cartGateway);
        let decremented;
        try {
            decremented = await decrementItemInCart.execute(productId, owner);
        } catch (e) {
            if (e instanceof Error) {
                // console.error("Couldn't create cart item:", e.message);
                return { msg: `Couldn't decrement cart item: ${e.message}.`, isError: true };
            }
            return { msg: `Couldn't decrement cart item: ${e}.`, isError: true };
        }
        setCartItems((prev) => {
            if (decremented.quantityAmount === 0) return prev.filter((i) => i.productId !== decremented.productId.number);
            let found = false;
            const next = prev.map((i) => {
                if (i.id !== decremented.id.number) return i;
                found = true;
                return CartItemStateMapper.toStateFromDomain(decremented);
            });
            return next;
        });

        // TODO: remove this log at some point
        console.log(`user updated this product:\nProduct id:\t${decremented.productId}\n${decremented}`);
        return { msg: "CartItem successful decremented", isError: false };
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

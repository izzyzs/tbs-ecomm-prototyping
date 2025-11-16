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
    remove: (productId: number) => void;
    decrement: (productId: number) => void;
    increment: (productId: number) => void;

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

        const { data: cartId, error: ensureCartError } = await supabase.rpc("ensure_carts", { user_id: userId });

        if (ensureCartError) {
            console.error("Ensure cart error");
            throw ensureCartError;
        }

        cartIdRef.current = cartId;
        return cartId;
    }

    const createCartItemFromDb = async (productId: number) => {
        const { data, error } = await supabase.from("inventory_11102025").select("id, item, brand, price, tax").eq("id", productId).limit(1).single();
        if (error) throw error;

        return {
            product_id: data.id,
            name: data.item,
            brand: data.brand,
            price: data.price,
            quantity: 0,
        } as CartItem;
    };

    const retrieveCartItems = async (cartId: number) => {
        const { data, error } = await supabase.from("test_cart_items").select("*");
    };

    const getCartItem = async (productId: number) => {
        if (productId in cartItems) {
            return cartItems[productId];
        }
        return await createCartItemFromDb(productId);
    };

    async function add(productId: number, userId: string | undefined) {
        console.log("**************\nsrc/context/CartContext.tsx\n**************");

        /*
        came up with step -1
        STEP -1) => cartItem is made first or retrieved from the state. then do the check for whether or not to add to db (for auth user) or to localStorage (for anon user)
        
        _Option 1:_ the user is logged in, but their cart's existence in db hasn't been verified: userId && !cartIdRef.current ==> ensure cart and set cartIdRef
        
        _Option 2_: the user is logged in, and cart definitely exists (cartIdRef is defined)
        
        From this point option 1 & 2 have the same path.
        
        Step 1)
        a: add item to cartItemsState then increase qty in state
        
        Step 2)
        update the db's cart quantity value to the local qty; NOT THE DELTA!
        TODO: inventory might have to set a limit for purchase for product... 
        
        _Option 3_: the user isn't logged in.
        
        Step 0) create cart storage in localStorage
        Then steps 1 and 2 mentioned above
        */
        const cartItem = await getCartItem(productId);
        cartItem.quantity++;
        setCartItems((prev) => ({ ...prev, [cartItem.id]: cartItem }));

        if (userId) {
            if (!cartIdRef.current) cartIdRef.current = await ensureCart(userId);
            /*
           cart_id BIGINT REFERENCES test_carts (id),
           product_id BIGINT REFERENCES inventory_11102025 (id),
           quantity INTEGER,
           added_at TIMESTAMP DEFAULT now()
           */

            const { data, error } = await supabase
                .from("test_cart_items")
                .insert([{ cart_id: cartIdRef.current, product_id: cartItem.product_id, quantity: cartItem.quantity }])
                .select();
            if (error) console.error(error);
            if (data) console.log(data); // TODO: remove debugging logging
            return;
        }

        // TODO: (11/16/2025) handle user side persistence
    }

    function remove(id: number) {
        // const i = this.cartItemObjects[id];
        setCartItems((prev) => {
            const { [id]: _, ...rest } = prev;
            return rest;
        });
    }

    function decrement(id: number) {
        setCartItems((prev) => {
            const item = prev[id];
            if (!item) return prev;

            const updatedItem = { ...item, quantity: item.quantity - 1 };

            if (updatedItem.quantity <= 0) {
                const { [id]: _, ...rest } = prev;
                return rest;
            }

            return { ...prev, [id]: updatedItem };
        });
    }

    function increment(id: number) {
        setCartItems((prev) => {
            const item = prev[id];
            if (!item) {
                return prev;
            }

            const updatedItem = { ...item, quantity: item.quantity + 1 };
            return { ...prev, [id]: updatedItem };
        });
    }

    const getById = (id: number) => cartItems[id];

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
        increment,
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

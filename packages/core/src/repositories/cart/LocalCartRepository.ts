import { Cart } from "@/entities/index.js";
import { CartItem, CartItemDraft } from "@/entities/index.js";
import { ProductId } from "@/entities/index.js";

export interface LocalCartRepository {
    saveCart(cart: Cart): Promise<void>;
    retrieveSingleCartItem(productId: ProductId): Promise<CartItem>;
    retrieveCartItems(): Promise<CartItem[]>;
    upsertCartItem(cartItemDraft: CartItemDraft): Promise<CartItem>;
    decrementCartItem(cartItemDraft: CartItemDraft): Promise<CartItem>;
    removeCartItem(productId: ProductId): Promise<void>;
}

export type LocalCartStorageDTO = {
    readonly productId: number;
    readonly name: string;
    readonly brand: string;
    readonly price: number;
    readonly quantity: number;
};

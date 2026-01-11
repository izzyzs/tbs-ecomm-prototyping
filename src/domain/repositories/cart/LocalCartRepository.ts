import { Cart } from "@/domain/cart/cart"
import { CartItem, CartItemDraft } from "@/domain/cart/cart-item";
import { ProductId } from "@/domain/identity";
import { Money } from "@/domain/money";

export interface LocalCartRepository {
    saveCart(cart: Cart): Promise<void>;
    retrieveCartItems(): Promise<CartItem[]>;
    addCartItem(cartItemDraft: CartItemDraft, qty?: number): Promise<CartItem>;
}

export type LocalCartStorageDTO = {
    readonly productId: number;
    readonly name: string;
    readonly brand: string;
    readonly price: number;
    readonly quantity: number;
}
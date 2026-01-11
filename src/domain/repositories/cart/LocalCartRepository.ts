import { Cart } from "@/domain/cart/cart"
import { CartItem, CartItemDraft } from "@/domain/cart/cart-item";
import { CartItemId, ProductId } from "@/domain/identity";
import { Money } from "@/domain/money";
import { Quantity } from "@/domain/quantity";


export interface LocalCartRepository {
    saveCart(cart: Cart): Promise<void>;
    retrieveSingleCartItem(productId: ProductId): Promise<CartItem>;
    retrieveCartItems(): Promise<CartItem[]>;
    addCartItem(cartItemDraft: CartItemDraft): Promise<CartItem>;
    decrementCartItem(cartItemDraft: CartItemDraft): Promise<CartItem>;
    removeCartItem(productId: ProductId): Promise<void>;
}

export type LocalCartStorageDTO = {
    readonly productId: number;
    readonly name: string;
    readonly brand: string;
    readonly price: number;
    readonly quantity: number;
}
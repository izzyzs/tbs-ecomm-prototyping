import { UserId, CartId, ProductId, CartItemId } from "../../identity"
import { CartItem, CartItemDraft } from "@/domain/cart/cart-item"
import { Cart } from "@/domain/cart/cart"
import { Quantity } from "@/domain/quantity";

export interface AuthenticatedCartRepository {
    // saveCart(cartId: CartId, cart: Cart): Promise<void>;
    ensureCart(userId: UserId): Promise<CartId>;
    retrieveSingleCartItem(cartId: CartId, cartItemId: CartItemId): Promise<CartItem>;
    retrieveCartItems(cartId: CartId): Promise<CartItem[]>;
    addCartItem(cartId: CartId, cartItemDraft: CartItemDraft): Promise<CartItem>;
    decrementCartItem(cartId: CartId, cartItemDraft: CartItemDraft): Promise<CartItem>;
    removeCartItem(productId: ProductId, cartId: CartId): Promise<void>;
    syncLocalCartWithDB(cartId: CartId, localCartArrayString: string): Promise<void>;
}

export class CartItemCreationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'CartItemCreationError';
    }
}
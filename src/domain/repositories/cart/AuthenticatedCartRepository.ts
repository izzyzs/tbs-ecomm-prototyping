import { UserId, CartId, ProductId } from "../../identity"
import { CartItem, CartItemDraft } from "@/domain/cart/cart-item.domain"
import { Cart } from "@/domain/cart/cart"

export interface AuthenticatedCartRepository {
    getCart(userId: UserId): Promise<Cart>;
    ensureCart(userId: UserId): Promise<CartId>;
    retrieveCartItems(userId: UserId): Promise<CartItem[]>;
    createCartItemDraft(productId: ProductId): Promise<CartItemDraft | null>;
    addCartItem(cartId: CartId, cartItemDraft: CartItemDraft): Promise<CartItem>;
    saveCart(cartId: CartId, cart: Cart): Promise<void>;
}

export class CartItemCreationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'CartItemCreationError';
    }
}
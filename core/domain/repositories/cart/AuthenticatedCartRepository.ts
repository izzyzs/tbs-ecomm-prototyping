import { UserId, CartId, ProductId, CartItemId } from "../../Identity";
import { CartItem, CartItemDraft } from "@/domain/cart/CartItem";
import { Cart } from "@/domain/cart/Cart";
import { Quantity } from "@/domain/Quantity";

export interface AuthenticatedCartRepository {
    // saveCart(cartId: CartId, cart: Cart): Promise<void>;
    ensureCart(userId: UserId): Promise<CartId>;
    retrieveSingleCartItem(cartId: CartId, productId: ProductId): Promise<CartItem>;
    retrieveCartItems(cartId: CartId): Promise<CartItem[]>;
    addCartItem(cartId: CartId, cartItemDraft: CartItemDraft): Promise<CartItem>;
    decrementCartItem(cartId: CartId, cartItemDraft: CartItemDraft): Promise<CartItem>;
    removeCartItem(productId: ProductId, cartId: CartId): Promise<void>;
    syncLocalCartWithDB(cartId: CartId, localCartArrayString: string): Promise<void>;
}

export class CartItemCreationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CartItemCreationError";
    }
}

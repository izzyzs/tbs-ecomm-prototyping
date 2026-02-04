import { UserId, CartId, ProductId } from "../../entities/index.js";
import { CartItem, CartItemDraft } from "../../entities/index.js";
import {LocalCartStorageDTO} from "../../repositories/index.js";

export interface AuthenticatedCartRepository {
    // saveCart(cartId: CartId, cart: Cart): Promise<void>;
    ensureCart(userId: UserId): Promise<CartId>;
    retrieveSingleCartItem(cartId: CartId, productId: ProductId): Promise<CartItem>;
    retrieveCartItems(cartId: CartId): Promise<CartItem[]>;
    upsertCartItem(cartId: CartId, cartItemDraft: CartItemDraft): Promise<CartItem>;
    decrementCartItem(cartId: CartId, cartItemDraft: CartItemDraft): Promise<CartItem>;
    removeCartItem(productId: ProductId, cartId: CartId): Promise<void>;
    syncLocalCartWithDB(cartId: CartId, localCartArrayString: LocalCartStorageDTO[]): Promise<void>;
}

export class CartItemCreationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CartItemCreationError";
    }
}

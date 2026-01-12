import { UserId, CartId, ProductId } from "../../Identity";
import { CartItem, CartItemDraft } from "@/domain/cart/CartItem";
export interface AuthenticatedCartRepository {
    ensureCart(userId: UserId): Promise<CartId>;
    retrieveSingleCartItem(cartId: CartId, productId: ProductId): Promise<CartItem>;
    retrieveCartItems(cartId: CartId): Promise<CartItem[]>;
    addCartItem(cartId: CartId, cartItemDraft: CartItemDraft): Promise<CartItem>;
    decrementCartItem(cartId: CartId, cartItemDraft: CartItemDraft): Promise<CartItem>;
    removeCartItem(productId: ProductId, cartId: CartId): Promise<void>;
    syncLocalCartWithDB(cartId: CartId, localCartArrayString: string): Promise<void>;
}
export declare class CartItemCreationError extends Error {
    constructor(message: string);
}
//# sourceMappingURL=AuthenticatedCartRepository.d.ts.map
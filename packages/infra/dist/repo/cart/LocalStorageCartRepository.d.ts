import { LocalCartRepository } from "@tbs/core";
import { Cart } from "@tbs/core";
import { CartItem, CartItemDraft } from "@tbs/core";
import { ProductId } from "@tbs/core";
export declare class LocalStorageCartRepository implements LocalCartRepository {
    saveCart(cart: Cart): Promise<void>;
    retrieveSingleCartItem(productId: ProductId): Promise<CartItem>;
    retrieveCartItems(): Promise<CartItem[]>;
    upsertCartItem(cartItemDraft: CartItemDraft): Promise<CartItem>;
    decrementCartItem(cartItemDraft: CartItemDraft): Promise<CartItem>;
    removeCartItem(productId: ProductId): Promise<void>;
}
//# sourceMappingURL=LocalStorageCartRepository.d.ts.map
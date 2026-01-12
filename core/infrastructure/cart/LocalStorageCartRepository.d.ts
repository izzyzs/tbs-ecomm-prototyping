import { LocalCartRepository } from "@/domain/repositories/cart/LocalCartRepository";
import { Cart } from "@/domain/cart/Cart";
import { CartItem, CartItemDraft } from "@/domain/cart/CartItem";
import { ProductId } from "@/domain/Identity";
export declare class LocalStorageCartRepository implements LocalCartRepository {
    saveCart(cart: Cart): Promise<void>;
    retrieveSingleCartItem(productId: ProductId): Promise<CartItem>;
    retrieveCartItems(): Promise<CartItem[]>;
    addCartItem(cartItemDraft: CartItemDraft): Promise<CartItem>;
    decrementCartItem(cartItemDraft: CartItemDraft): Promise<CartItem>;
    removeCartItem(productId: ProductId): Promise<void>;
}
//# sourceMappingURL=LocalStorageCartRepository.d.ts.map

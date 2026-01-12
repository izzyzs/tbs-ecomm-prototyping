import { Cart } from "@/domain/cart/Cart";
import { CartItem, CartItemDraft } from "@/domain/cart/CartItem";
import { ProductId } from "@/domain/Identity";

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
};
//# sourceMappingURL=LocalCartRepository.d.ts.map

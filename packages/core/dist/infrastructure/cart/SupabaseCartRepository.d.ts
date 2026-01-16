import { CartItem, CartItemDraft } from "@/domain/cart/CartItem";
import { CartId, ProductId, UserId } from "@/domain/Identity";
import { AuthenticatedCartRepository } from "@/domain/repositories/cart/AuthenticatedCartRepository";
import { BrowserSupabaseClient } from "@/lib/supabase/client";
export declare class SupabaseCartRepository implements AuthenticatedCartRepository {
    private supabase;
    constructor(supabase: BrowserSupabaseClient);
    ensureCart(userId: UserId): Promise<CartId>;
    retrieveSingleCartItem(cartId: CartId, productId: ProductId): Promise<CartItem>;
    retrieveCartItems(cartId: CartId): Promise<CartItem[]>;
    addCartItem(cartId: CartId, cartItemDraft: CartItemDraft): Promise<CartItem>;
    decrementCartItem(cartId: CartId, cartItemDraft: CartItemDraft): Promise<CartItem>;
    removeCartItem(productId: ProductId, cartId: CartId): Promise<void>;
    syncLocalCartWithDB(cartId: CartId, localCartArrayString: string): Promise<void>;
}
//# sourceMappingURL=SupabaseCartRepository.d.ts.map
import { CartItem, CartItemDraft } from "@tbs/core";
import { CartId, ProductId, UserId } from "@tbs/core";
import { AuthenticatedCartRepository } from "@tbs/core";
import { BrowserSupabaseClient } from "../../lib/supabase/client.js";
export declare class SupabaseCartRepository implements AuthenticatedCartRepository {
    private supabase;
    constructor(supabase: BrowserSupabaseClient);
    ensureCart(userId: UserId): Promise<CartId>;
    retrieveSingleCartItem(cartId: CartId, productId: ProductId): Promise<CartItem>;
    retrieveCartItems(cartId: CartId): Promise<CartItem[]>;
    upsertCartItem(cartId: CartId, cartItemDraft: CartItemDraft): Promise<CartItem>;
    decrementCartItem(cartId: CartId, cartItemDraft: CartItemDraft): Promise<CartItem>;
    removeCartItem(productId: ProductId, cartId: CartId): Promise<void>;
    syncLocalCartWithDB(cartId: CartId, localCartArrayString: string): Promise<void>;
}
//# sourceMappingURL=SupabaseCartRepository.d.ts.map
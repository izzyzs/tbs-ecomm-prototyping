import { ProductId } from "@tbs/core";
import { client } from "../../lib/supabase/index.js";
import { InventoryRepository, CartItemDetails } from "@tbs/core";
export declare class SupabaseInventoryRepository implements InventoryRepository {
    private supabase;
    constructor(supabase: client.BrowserSupabaseClient);
    getProductDetailsForCartItems(productId: ProductId): Promise<CartItemDetails | null>;
}
//# sourceMappingURL=SupabaseInventoryRepository.d.ts.map
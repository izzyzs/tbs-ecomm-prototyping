import { ProductId } from "@/core/domain/identity";
import { BrowserSupabaseClient } from "@/lib/supabase/client";
import InventoryRepository, { CartItemDetails } from "@/core/domain/repositories/inventory/InventoryRepository";
export declare class SupabaseInventoryRepository implements InventoryRepository {
    private supabase;
    constructor(supabase: BrowserSupabaseClient);
    getProductById(id: string): Promise<InventoryProduct>;
    getProductsByBrand(brand: string): Promise<InventoryProduct[]>;
    getProductDetailsForCartItems(productId: ProductId): Promise<CartItemDetails | null>;
}
//# sourceMappingURL=SupabaseInventoryRepository.d.ts.map
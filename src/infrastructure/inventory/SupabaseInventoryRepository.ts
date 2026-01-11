import { ProductId } from "@/domain/identity";
import { CartItemCreationError } from "@/domain/repositories/cart/AuthenticatedCartRepository";
import { BrowserSupabaseClient } from "@/lib/supabase/client";
import { requiredField } from "../helper-functions";
import InventoryRepository, { CartItemDetails } from "@/domain/repositories/inventory/InventoryRepository";

export class SupabaseInventoryRepository implements InventoryRepository {
    constructor (
        private supabase: BrowserSupabaseClient,
    ) {}

    getProductById(id: string): Promise<InventoryProduct> {}

    getProductsByBrand(brand: string): Promise<InventoryProduct[]> {}

    async getProductDetailsForCartItems(productId: ProductId): Promise<CartItemDetails | null> {
        const { data, error } = await this.supabase.from("inventory").select("id, item, brand, price").eq("id", productId.number).limit(1).single();
        // TODO: come back and uncomment if you need the tax boolean
        // const { data, error } = await this.supabase.from("inventory").select("id, item, brand, price, tax").eq("id", productId.number).limit(1).single();
        if (error) {
            throw new CartItemCreationError(`${error.message}`);
        }

        const details: CartItemDetails =  { 
            id: data.id, 
            name: requiredField(data.item, CartItemCreationError, "data.item"),
            brand: requiredField(data.brand, CartItemCreationError, "data.brand"),
            price: requiredField(data.price, CartItemCreationError, "data.price"),
        }

        return details;
    }
}
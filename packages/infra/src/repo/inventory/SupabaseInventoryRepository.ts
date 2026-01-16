import { ProductId } from "@tbs/core";
import { CartItemCreationError } from "@tbs/core";
import { client } from "../../lib/supabase/index.js";
import { requiredField } from "../../helper-functions.js";
import { InventoryRepository, CartItemDetails } from "@tbs/core";
import { InventoryProduct } from "@tbs/core";

export class SupabaseInventoryRepository implements InventoryRepository {
    constructor(private supabase: client.BrowserSupabaseClient) {}

    // async getProductById(id: number): Promise<InventoryProduct> {
    //     let product: InventoryProduct;
    //     const { data, error } = await this.supabase.from("inventory").select("*").eq("id", id).single();
    //     product = new InventoryProduct();
    //     return product;
    // }

    // getProductsByBrand(brand: string): Promise<InventoryProduct[]> {}

    async getProductDetailsForCartItems(productId: ProductId): Promise<CartItemDetails | null> {
        const { data, error } = await this.supabase.from("inventory").select("id, item, brand, price").eq("id", productId.number).limit(1).single();
        // TODO: come back and uncomment if you need the tax boolean
        // const { data, error } = await this.supabase.from("inventory").select("id, item, brand, price, tax").eq("id", productId.number).limit(1).single();
        if (error) {
            throw new CartItemCreationError(`${error.message}`);
        }

        const details: CartItemDetails = {
            id: data.id,
            name: requiredField(data.item, CartItemCreationError, "data.item"),
            brand: requiredField(data.brand, CartItemCreationError, "data.brand"),
            price: requiredField(data.price, CartItemCreationError, "data.price"),
        };

        return details;
    }
}

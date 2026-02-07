import { CartItem, CartItemNotFoundError, SKU } from "@tbs/core";
import { CartId, ProductId, CartItemId } from "@tbs/core";
import { Money } from "@tbs/core";
import { Quantity } from "@tbs/core";
import { CartItemCreationError } from "@tbs/core";
import { requiredField } from "../../helper-functions.js";
import { SupabaseError } from "../../Errors.js";
import { InventoryMapper } from "@tbs/adapters";
export class SupabaseCartRepository {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async ensureCart(userId) {
        const { data: cartId, error: ensureCartError } = await this.supabase.rpc("ensure_cart", { user_id: userId.value });
        if (ensureCartError) {
            throw ensureCartError;
        }
        return new CartId(cartId);
    }
    async retrieveSingleCartItem(cartId, productId) {
        const { data: cartItemData, error: cartItemError } = await this.supabase.from("cart_items").select("*").eq("cart_id", cartId.number).eq("product_id", productId.number).single();
        if (!cartItemData) {
            throw new CartItemNotFoundError(`Cart item doesn't exist`);
        }
        if (cartItemError)
            throw cartItemError;
        const { data: skuData } = await this.supabase
            .from("inventory")
            .select("price, upc, manufact_sku, custom_sku, item, brand")
            .eq("id", requiredField(cartItemData.product_id, SupabaseError, "cartItemData.product_id"))
            .single();
        if (!skuData || !skuData.price) {
            throw new CartItemNotFoundError("Item doesn't exist");
        }
        return new CartItem(new CartItemId(cartItemData.id), new ProductId(requiredField(cartItemData.product_id, SupabaseError, "cartItemData.product_id")), new SKU((skuData.upc ?? skuData.manufact_sku ?? skuData.custom_sku)), // one of these three values will undoubtedly be set.
        requiredField(skuData.item, SupabaseError, "skuData.item"), requiredField(skuData.brand, SupabaseError, "skuData.brand"), InventoryMapper.priceDBtoDomain(skuData.price), new Quantity(requiredField(cartItemData.quantity, SupabaseError, "cartItemData.quantity")));
    }
    async retrieveCartItems(cartId) {
        const { data, error } = await this.supabase.rpc("retrieve_cart_items", { p_cart_id: cartId.number });
        if (error) {
            throw error;
        }
        if (!data) {
            return [];
        }
        const items = data.map((item) => {
            const priceInPennies = +(item.price.toString().replace(/\./, ""));
            return new CartItem(new CartItemId(item.id), new ProductId(item.productId), new SKU(item.sku), item.name, item.brand, new Money(priceInPennies), new Quantity(item.quantity));
        });
        return items;
    }
    async upsertCartItem(cartId, cartItemDraft) {
        const { data, error } = await this.supabase.rpc("add_cart_item", { p_cart_id: cartId.number, p_product_id: cartItemDraft.productId.number, p_sku: cartItemDraft.sku.value, p_quantity: cartItemDraft.quantity.amount });
        if (error) {
            throw new CartItemCreationError(`Ran into issue adding cart item\n${JSON.stringify(error)}`);
        }
        const item = new CartItem(new CartItemId(data.id), new ProductId(requiredField(data.product_id, CartItemCreationError, "data.product_id")), new SKU(data.sku), cartItemDraft.name, cartItemDraft.brand, cartItemDraft.price, new Quantity(requiredField(data.quantity, CartItemCreationError, "data.quantity")));
        return item;
    }
    async decrementCartItem(cartId, cartItemDraft) {
        const { data: cartItemData, error: cartItemError } = await this.supabase
            .from("cart_items")
            .update({ quantity: cartItemDraft.quantity.amount })
            .eq("cart_id", cartId.number)
            .eq("product_id", cartItemDraft.productId.number)
            .select()
            .single();
        if (cartItemError) {
            throw cartItemError;
        }
        const decremented = new CartItem(new CartItemId(cartItemData.id), cartItemDraft.productId, cartItemDraft.sku, cartItemDraft.name, cartItemDraft.brand, cartItemDraft.price, cartItemDraft.quantity);
        return decremented;
    }
    async removeCartItem(productId, cartId) {
        const { data, error } = await this.supabase.from("cart_items").delete().eq("cart_id", cartId.number).eq("product_id", productId.number).select();
        if (error) {
            throw error;
        }
    }
    async syncLocalCartWithDB(cartId, localCartArray) {
        // const { data, error } = await this.supabase.rpc("sync_local_cart_to_db", { p_cart_id: cartId.number, p_local_cart: localCartArrayString });
        const cartItemInsertArray = localCartArray.map((i) => {
            return {
                cart_id: cartId.number,
                product_id: i.productId,
                quantity: i.quantity,
                sku: i.sku
            };
        });
        const { data, error } = await this.supabase.from("cart_items").insert(cartItemInsertArray);
        if (error)
            throw error;
    }
}

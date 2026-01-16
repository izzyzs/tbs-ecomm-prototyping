import { CartItem, CartItemNotFoundError } from "@tbs/core";
import { CartId, ProductId, CartItemId } from "@tbs/core";
import { Money } from "@tbs/core";
import { Quantity } from "@tbs/core";
import { CartItemCreationError } from "@tbs/core";
import { requiredField } from "../../helper-functions.js";
import { SupabaseError } from "../../Errors.js";
export class SupabaseCartRepository {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async ensureCart(userId) {
        const { data: cartId, error: ensureCartError } = await this.supabase.rpc("ensure_cart", { user_id: userId.value });
        if (ensureCartError) {
            console.error("CartContext.ensureCart error");
            throw ensureCartError;
        }
        return new CartId(cartId);
    }
    async retrieveSingleCartItem(cartId, productId) {
        // const { data: cartItemData, error: cartItemError } = await this.supabase.from("cart_items").select("*").eq("id", cartItemId.number).single()
        const { data: cartItemData, error: cartItemError } = await this.supabase.from("cart_items").select("*").eq("cart_id", cartId.number).eq("product_id", productId.number).single();
        if (!cartItemData)
            throw new CartItemNotFoundError(`Cart item doesn't exist`);
        if (cartItemError)
            throw cartItemError;
        const { data: skuData } = await this.supabase
            .from("inventory")
            .select("price, item, brand")
            .eq("id", requiredField(cartItemData.product_id, SupabaseError, "cartItemData.product_id"))
            .single();
        if (!skuData || !skuData.price)
            throw new CartItemNotFoundError("Item doesn't exist");
        const price = new Money(+skuData.price.replace(/\$|./g, ""));
        const cartItem = new CartItem(new CartItemId(cartItemData.id), new ProductId(requiredField(cartItemData.product_id, SupabaseError, "cartItemData.product_id")), requiredField(skuData.item, SupabaseError, "skuData.item"), requiredField(skuData.brand, SupabaseError, "skuData.brand"), price, new Quantity(requiredField(cartItemData.quantity, SupabaseError, "cartItemData.quantity")));
        return cartItem;
    }
    async retrieveCartItems(cartId) {
        const { data, error } = await this.supabase.rpc("retrieve_cart_items", { p_cart_id: cartId.number });
        if (error) {
            console.error("retrieveCartItems error");
            console.error(error);
            throw error;
        }
        if (!data) {
            return [];
        }
        console.log("RETRIEVE CART ITEMS DATA", data);
        const items = data.map((item) => {
            const priceInPennies = +(item.price.toString().replace(/\./, ""));
            return new CartItem(new CartItemId(item.id), new ProductId(item.productId), item.name, item.brand, new Money(priceInPennies), new Quantity(item.quantity));
        });
        return items;
    }
    async upsertCartItem(cartId, cartItemDraft) {
        const { data, error } = await this.supabase.rpc("add_cart_item", { p_cart_id: cartId.number, p_product_id: cartItemDraft.productId.number, p_quantity: cartItemDraft.quantity.amount });
        if (error) {
            console.error(error);
            throw new CartItemCreationError(`Ran into issue adding cart item: ${error}`);
        }
        const item = new CartItem(new CartItemId(data.id), new ProductId(requiredField(data.product_id, CartItemCreationError, "data.product_id")), cartItemDraft.name, cartItemDraft.brand, cartItemDraft.price, new Quantity(requiredField(data.quantity, CartItemCreationError, "data.quantity")));
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
            console.error(cartItemError);
            throw cartItemError;
        }
        const decremented = new CartItem(new CartItemId(cartItemData.id), cartItemDraft.productId, cartItemDraft.name, cartItemDraft.brand, cartItemDraft.price, cartItemDraft.quantity);
        return decremented;
    }
    async removeCartItem(productId, cartId) {
        const { data, error } = await this.supabase.from("cart_items").delete().eq("cart_id", cartId.number).eq("product_id", productId.number).select();
        if (error) {
            console.error("SupabaseCartRepository.removeCartItem() error");
            console.error(error);
            throw error;
        }
    }
    async syncLocalCartWithDB(cartId, localCartArrayString) {
        const { data, error } = await this.supabase.rpc("sync_local_cart_to_db", { p_cart_id: cartId.number, p_local_cart: localCartArrayString });
        if (error) {
            throw error;
        }
    }
}

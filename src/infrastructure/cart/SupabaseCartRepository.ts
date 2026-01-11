import { CartItem, CartItemDraft } from "@/domain/cart/cart-item";
import { Cart } from "@/domain/cart/cart"
import { CartId, ProductId, UserId, CartItemId } from "@/domain/identity";
import { Money } from "@/domain/money";
import { Quantity } from "@/domain/quantity"
import { AuthenticatedCartRepository, CartItemCreationError } from "@/domain/repositories/cart/AuthenticatedCartRepository";

import { requiredField } from "@/infrastructure/helper-functions"

import { BrowserSupabaseClient, createClient } from "@/lib/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/database.types";

export class SupabaseCartRepository implements AuthenticatedCartRepository {
    constructor(
        private supabase: BrowserSupabaseClient
    ) {}

    async ensureCart(userId: UserId): Promise<CartId> {
        const { data: cartId, error: ensureCartError } = await this.supabase.rpc("ensure_cart", { user_id: userId.value });

        if (ensureCartError) {
            console.error("CartContext.ensureCart error");
            throw ensureCartError;
        }

        return new CartId(cartId)
    }


    async retrieveCartItems(cartId: CartId): Promise<CartItem[]> {

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
        const items: CartItem[] = JSON.parse(data.toString())
        return items;
    }

    async addCartItem(cartId: CartId, cartItemDraft: CartItemDraft, qty: number = 1): Promise<CartItem> {
        const quantity = new Quantity(qty)
        const { data, error } = await this.supabase.rpc("add_cart_item", { p_cart_id: cartId.number, p_product_id: cartItemDraft.productId.number, p_quantity: quantity.amount });
        if (error) {
            console.error("SupabaseCartRepository.addCartItem error");
            throw new CartItemCreationError(`Ran into issue adding cart item: ${error}`);
        }
        
        const item = new CartItem(
            new CartItemId(data.id),
            new ProductId(requiredField(data.product_id, CartItemCreationError, "data.product_id")),
            cartItemDraft.name,
            cartItemDraft.brand,
            cartItemDraft.price,
            new Quantity(requiredField(data.quantity, CartItemCreationError, "data.quantity"))
        )
        return item;
    }

    async syncLocalCartWithDB(cartId: CartId, localCartArrayString: string): Promise<void> {
        const { data, error } = await this.supabase.rpc("sync_local_cart_to_db", { p_cart_id: cartId.number, p_local_cart: localCartArrayString });
        if (error) {
            console.error("CartProvider.syncLocalCartWithDB() error");
            console.error(error);
        }
    }
}
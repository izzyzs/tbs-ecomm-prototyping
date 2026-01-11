import { LocalCartRepository, LocalCartStorageDTO } from "@/domain/repositories/cart/LocalCartRepository";
import { Cart } from "@/domain/cart/cart";
import { LocalStorageError } from "@/infrastructure/cart/Errors";
import { CartItem, CartItemDraft } from "@/domain/cart/cart-item";
import { ProductId, CartItemId } from "@/domain/identity";
import { BrowserSupabaseClient } from "@/lib/supabase/client";
import { requiredField } from "../helper-functions";
import { Quantity } from "@/domain/quantity";
import CartItemMapper from "@/interface-adapters/mappers/cart-item.mapper";

export class LocalStorageCartRepository implements LocalCartRepository {
    async saveCart(cart: Cart): Promise<void> {

    }

    async retrieveCartItems(): Promise<CartItem[]> {
        const cartString = localStorage.getItem("cart");
        const cartItemsDTO: LocalCartStorageDTO[] = JSON.parse(requiredField(cartString, LocalStorageError, "cart"))
        const cartItems = cartItemsDTO.map((item, idx) => {
            const id = new CartItemId(idx)
            return CartItemMapper.toDomainFromLocalDTO(id, item)
        })
        return cartItems;
    }


    async addCartItem(cartItemDraft: CartItemDraft, qty: number = 1): Promise<CartItem> {
        const oldCartString = localStorage.getItem("cart");
        const quantity = new Quantity(qty);
        const oldCart = JSON.parse(oldCartString ?? "[]");
        const newItem = CartItemMapper.toLocalDTOFromDraft(cartItemDraft, quantity);
        const newCart = [...oldCart, newItem]
        localStorage.setItem("cart", JSON.stringify(newCart))
        const id = new CartItemId(oldCart.length)
        return CartItemMapper.toDomainFromLocalDTO(id, newItem);
    };
}
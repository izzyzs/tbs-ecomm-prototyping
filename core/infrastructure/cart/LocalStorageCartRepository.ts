import { LocalCartRepository, LocalCartStorageDTO } from "@/domain/repositories/cart/LocalCartRepository";
import { Cart } from "@/domain/cart/Cart";
import { LocalStorageError } from "@/infrastructure/cart/Errors";
import { CartItem, CartItemDraft, CartItemNotFoundError } from "@/domain/cart/CartItem";
import { ProductId, CartItemId } from "@/domain/Identity";
import { BrowserSupabaseClient } from "@/lib/supabase/client";
import { requiredField } from "../helper-functions";
import { Quantity } from "@/domain/quantity";
import CartItemMapper from "@/interface-adapters/mappers/cart-item.mapper";

export class LocalStorageCartRepository implements LocalCartRepository {
    async saveCart(cart: Cart): Promise<void> {}

    async retrieveSingleCartItem(productId: ProductId): Promise<CartItem> {
        const cartString = localStorage.getItem("cart");
        const cartItemsDTO: LocalCartStorageDTO[] = JSON.parse(requiredField(cartString, LocalStorageError, "cart"));
        const cartItemId = cartItemsDTO.findIndex((i) => i.productId === productId.number);
        const cartItemDTO = cartItemsDTO.find((i) => i.productId === productId.number);
        if (!cartItemDTO || !cartItemId) throw new CartItemNotFoundError("cart item not in cart");
        const cartItem = CartItemMapper.toDomainFromLocalDTO(new CartItemId(cartItemId), cartItemDTO);
        return cartItem;
    }

    async retrieveCartItems(): Promise<CartItem[]> {
        const cartString = localStorage.getItem("cart");
        const cartItemsDTO: LocalCartStorageDTO[] = JSON.parse(requiredField(cartString, LocalStorageError, "cart"));
        const cartItems = cartItemsDTO.map((item, idx) => {
            const id = new CartItemId(idx);
            return CartItemMapper.toDomainFromLocalDTO(id, item);
        });
        return cartItems;
    }

    async addCartItem(cartItemDraft: CartItemDraft): Promise<CartItem> {
        const oldCartString = localStorage.getItem("cart");
        let oldCart: LocalCartStorageDTO[] = JSON.parse(requiredField(oldCartString, LocalStorageError, "oldCartString"));
        // const oldCart: LocalCartStorageDTO[] = JSON.parse(oldCartString ?? "[]");
        const newItem: LocalCartStorageDTO = CartItemMapper.toLocalDTOFromDraft(cartItemDraft);
        const newCart: LocalCartStorageDTO[] = [...oldCart, newItem];
        localStorage.setItem("cart", JSON.stringify(newCart));
        const id = new CartItemId(oldCart.length);
        return CartItemMapper.toDomainFromLocalDTO(id, newItem);
    }

    async decrementCartItem(cartItemDraft: CartItemDraft): Promise<CartItem> {
        const oldCartString = localStorage.getItem("cart");
        let oldCart: LocalCartStorageDTO[] = JSON.parse(requiredField(oldCartString, LocalStorageError, "oldCartString"));
        const newCart = oldCart.map((i) => {
            if (cartItemDraft.productId.number === i.productId) return CartItemMapper.toLocalDTOFromDraft(cartItemDraft);
            return i;
        });
        localStorage.setItem("cart", JSON.stringify(newCart));

        const decrementedDTO = requiredField(
            newCart.find((i) => i.productId === cartItemDraft.productId.number),
            LocalStorageError,
            "matching cart item by id"
        );
        const idx = new CartItemId(
            requiredField(
                newCart.findIndex((i) => i.productId === cartItemDraft.productId.number),
                LocalStorageError,
                "matching cart item id for CartItemId"
            )
        );
        const decremented: CartItem = CartItemMapper.toDomainFromLocalDTO(idx, decrementedDTO);
        return decremented;
    }

    async removeCartItem(productId: ProductId): Promise<void> {
        const oldCartString = localStorage.getItem("cart");
        let oldCart: LocalCartStorageDTO[] = JSON.parse(requiredField(oldCartString, LocalStorageError, "oldCartString"));
        const item = oldCart.filter((i) => i.productId === productId.number)[0];
        const rest = oldCart.filter((i) => i.productId !== productId.number);
        localStorage.setItem("cart", JSON.stringify(rest));
    }
}

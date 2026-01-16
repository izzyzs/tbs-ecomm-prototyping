import { LocalStorageError } from "../../Errors.js";
import { CartItemNotFoundError } from "@tbs/core";
import { CartItemId } from "@tbs/core";
import { requiredField } from "../../helper-functions.js";
import { CartItemMapper } from "@tbs/adapters";
export class LocalStorageCartRepository {
    // until id structure is refined; cartItemId => productId to improve idempotency.
    // id is shifted time and time again during the creation, storing, and retrieval of these items.
    async saveCart(cart) { }
    async retrieveSingleCartItem(productId) {
        const cartString = localStorage.getItem("cart");
        console.log("LocalStorageCartRepository.retrieveSingleCartItem: cartString\n", cartString);
        const cartItemsDTO = cartString ? JSON.parse(requiredField(cartString, LocalStorageError, "cart")) : [];
        console.log("LocalStorageCartRepository.retrieveSingleCartItems: cartItemsDto\n", cartItemsDTO);
        // const cartItemId = cartItemsDTO.findIndex((i) => i.productId === productId.number);
        const cartItemDTO = cartItemsDTO.find((i) => i.productId === productId.number);
        console.log("cartItemDTO", cartItemDTO);
        if (!cartItemDTO)
            throw new CartItemNotFoundError("cart item not in cart");
        const cartItem = CartItemMapper.toDomainFromLocalDTO(new CartItemId(productId.number), cartItemDTO);
        return cartItem;
    }
    async retrieveCartItems() {
        const cartString = localStorage.getItem("cart");
        console.log("LocalStorageCartRepository.retrieveCartItems: cartString\n", cartString);
        const cartItemsDTO = cartString ? JSON.parse(requiredField(cartString, LocalStorageError, "cart")) : [];
        const cartItems = cartItemsDTO.map((item, idx) => {
            const id = new CartItemId(item.productId);
            return CartItemMapper.toDomainFromLocalDTO(id, item);
        });
        return cartItems;
    }
    async upsertCartItem(cartItemDraft) {
        const oldCartString = localStorage.getItem("cart");
        let oldCart = oldCartString ? JSON.parse(requiredField(oldCartString, LocalStorageError, "oldCartString")) : [];
        const newItem = CartItemMapper.toLocalDTOFromDraft(cartItemDraft);
        const itemExists = oldCart.find(i => i.productId === cartItemDraft.productId.number);
        let newCart;
        if (itemExists) {
            const otherItems = oldCart.filter(i => i.productId !== cartItemDraft.productId.number);
            newCart = [...otherItems, newItem];
        }
        else {
            newCart = [...oldCart, newItem];
        }
        localStorage.setItem("cart", JSON.stringify(newCart));
        const id = new CartItemId(newItem.productId);
        return CartItemMapper.toDomainFromLocalDTO(id, newItem);
    }
    async decrementCartItem(cartItemDraft) {
        const oldCartString = localStorage.getItem("cart");
        let oldCart = oldCartString ? JSON.parse(requiredField(oldCartString, LocalStorageError, "oldCartString")) : [];
        const newItem = CartItemMapper.toLocalDTOFromDraft(cartItemDraft);
        const newCart = oldCart.map((i) => {
            if (newItem.productId === i.productId)
                return newItem;
            return i;
        });
        localStorage.setItem("cart", JSON.stringify(newCart));
        const id = new CartItemId(newItem.productId);
        return CartItemMapper.toDomainFromLocalDTO(id, newItem);
    }
    async removeCartItem(productId) {
        const oldCartString = localStorage.getItem("cart");
        let oldCart = oldCartString ? JSON.parse(requiredField(oldCartString, LocalStorageError, "oldCartString")) : [];
        const item = oldCart.filter((i) => i.productId === productId.number)[0];
        const rest = oldCart.filter((i) => i.productId !== productId.number);
        localStorage.setItem("cart", JSON.stringify(rest));
    }
}

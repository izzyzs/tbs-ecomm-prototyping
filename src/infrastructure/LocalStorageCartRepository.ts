import { LocalCartRepository } from "@/domain/repositories/cart/LocalCartRepository";
import { Cart } from "@/domain/cart/cart";
import { requiredField, LocalStorageError } from "./helper-functions";

export class LocalStorageCartRepository implements LocalCartRepository {
    async getCart(): Promise<Cart> {
        const cartString = localStorage.getItem("cart");
        const cartItems:  = JSON.parse(requiredField(cartString, LocalStorageError, "cart"))
    }
}
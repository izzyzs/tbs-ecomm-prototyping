import { Cart } from "@/domain/cart/cart"

export interface LocalCartRepository {
    getCart(): Promise<Cart>;
    saveCart()
}
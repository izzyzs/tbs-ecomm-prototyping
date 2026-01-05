import { Cart } from "@/domain/cart/cart";
import { CartItemDraft, ProductUnavailableError } from "@/domain/cart/cart-item.domain";
import { UserId, ProductId } from "@/domain/identity";
import CartRepository from "@/domain/repositories/cart/AuthenticatedCartRepository";

class GetCartItem {
    constructor(
        private cartRepository: CartRepository
    ) {}

    async execute(productId: ProductId, userId?: UserId): Promise<CartItemDraft> {
        if (userId) {
            const cart = await this.cartRepository.getCart(userId)
            const existing = cart.findCartItem(productId)
            if (existing) return existing;
        }

        const created = await this.cartRepository.createCartItemDraft(productId)
        if (!created) {
            throw new ProductUnavailableError("the product is unavailable.")
        }
        return created;
    }
}

export default GetCartItem;
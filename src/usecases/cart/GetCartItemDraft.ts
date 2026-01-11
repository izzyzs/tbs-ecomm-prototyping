import { Cart } from "@/domain/cart/cart";
import { CartItemDraft, ProductUnavailableError } from "@/domain/cart/cart-item";
import { UserId, ProductId } from "@/domain/identity";
import { AuthenticatedCartRepository } from "@/domain/repositories/cart/AuthenticatedCartRepository";
import { CreateCartItemDraft } from "./CreateCartItemDraft";
import CartItemMapper from "@/interface-adapters/mappers/cart-item.mapper";

class GetCartItemDraft {
    constructor(
        private authenticatedCartRepository: AuthenticatedCartRepository,
        private createCartItemDraft: CreateCartItemDraft
    ) {}

    async execute(productId: ProductId, userId?: UserId): Promise<CartItemDraft> {
        if (userId) {
            const cartId = await this.authenticatedCartRepository.ensureCart(userId);
            const cartItems = await this.authenticatedCartRepository.retrieveCartItems(cartId);
            const cart = new Cart(cartId, userId, cartItems);
            const existing = cart.findCartItem(productId)
            if (existing) return CartItemMapper.toDraftFromDomain(existing);
        }

        const created = await this.createCartItemDraft.execute(productId)
        if (!created) {
            throw new ProductUnavailableError("the product is unavailable.")
        }
        return created;
    }
}

export default GetCartItemDraft;
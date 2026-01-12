import { LocalCartRepository } from "@/domain/repositories/cart/LocalCartRepository";
import { AuthenticatedCartRepository } from "@/domain/repositories/cart/AuthenticatedCartRepository";
import { CartItem, CartItemDraft } from "@/domain/cart/CartItem";
import { CartOwner, ProductId } from "@/domain/Identity";

export interface CartGateway {
    addCartItem(cartItemDraft: CartItemDraft, owner: CartOwner): Promise<CartItem>;
    decrementCartItem(cartItemDraft: CartItemDraft, owner: CartOwner): Promise<CartItem>;
    removeCartItem(productId: ProductId, owner: CartOwner): Promise<void>;
    retrieveSingleCartItem(productId: ProductId, owner: CartOwner): Promise<CartItem>;
}

export class DefaultCartGateway implements CartGateway {
    constructor(
        private localCartRepository: LocalCartRepository,
        private authenticatedCartRepository: AuthenticatedCartRepository
    ) {}

    async addCartItem(cartItemDraft: CartItemDraft, owner: CartOwner): Promise<CartItem> {
        if (owner.kind === "Authenticated") {
            return await this.authenticatedCartRepository.addCartItem(owner.cartId, cartItemDraft);
        }
        return await this.localCartRepository.addCartItem(cartItemDraft);
    }

    async decrementCartItem(cartItemDraft: CartItemDraft, owner: CartOwner): Promise<CartItem> {
        if (owner.kind === "Authenticated") {
            return await this.authenticatedCartRepository.decrementCartItem(owner.cartId, cartItemDraft);
        }
        return await this.localCartRepository.decrementCartItem(cartItemDraft);
    }

    async removeCartItem(productId: ProductId, owner: CartOwner): Promise<void> {
        if (owner.kind === "Authenticated") {
            return await this.authenticatedCartRepository.removeCartItem(productId, owner.cartId);
        }
        return await this.localCartRepository.removeCartItem(productId);
    }

    async retrieveSingleCartItem(productId: ProductId, owner: CartOwner): Promise<CartItem> {
        if (owner.kind === "Authenticated") {
            return await this.authenticatedCartRepository.retrieveSingleCartItem(owner.cartId, productId);
        }
        return await this.localCartRepository.retrieveSingleCartItem(productId);
    }
}

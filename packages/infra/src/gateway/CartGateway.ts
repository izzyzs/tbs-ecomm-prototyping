import { LocalCartRepository } from "@tbs/core";
import { AuthenticatedCartRepository } from "@tbs/core";
import { CartItem, CartItemDraft } from "@tbs/core";
import { CartOwner, ProductId } from "@tbs/core";

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
            return await this.authenticatedCartRepository.upsertCartItem(owner.cartId, cartItemDraft);
        }
        return await this.localCartRepository.upsertCartItem(cartItemDraft);
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

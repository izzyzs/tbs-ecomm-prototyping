import { LocalCartRepository } from "@tbs/core";
import { AuthenticatedCartRepository } from "@tbs/core";
import { CartItem, CartItemDraft } from "@tbs/core";
import { CartOwner, ProductId } from "@tbs/core";
import * as zlib from "node:zlib";

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
        console.log("********************\nDefaultCartGateway.addCartItem()\n********************\n")
            console.log("draft to be upsterted: ", cartItemDraft);
        if (owner.kind === "Authenticated") {
            console.log("authenticated")
            const item = await this.authenticatedCartRepository.upsertCartItem(owner.cartId, cartItemDraft);
            console.log("new CartItem after upstert", item);
            return item;
        }
        console.log("********************\nInauthenticatedItemCreation\n********************\n")
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
        console.log("-------------------\ninside DefaultCartGateway.retrieveSingleCartItem()\n-------------------\n")
        if (owner.kind === "Authenticated") {
            console.log("user is authenticated");
            console.log("retreiving order with this.authenticatedCartRepository.retrieveSingleCartItem(owner.cartId, productId)");
            const item = await this.authenticatedCartRepository.retrieveSingleCartItem(owner.cartId, productId);
            console.log("item retrieved: ", item);
        console.log("-------------------\nend of DefaultCartGateway.retrieveSingleCartItem, just returning item\n-------------------\n")
            return item;
        }
        return await this.localCartRepository.retrieveSingleCartItem(productId);
    }
}

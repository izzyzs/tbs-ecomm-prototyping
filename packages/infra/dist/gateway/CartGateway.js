export class DefaultCartGateway {
    constructor(localCartRepository, authenticatedCartRepository) {
        this.localCartRepository = localCartRepository;
        this.authenticatedCartRepository = authenticatedCartRepository;
    }
    async addCartItem(cartItemDraft, owner) {
        console.log("********************\nDefaultCartGateway.addCartItem()\n********************\n");
        console.log("draft to be upsterted: ", cartItemDraft);
        if (owner.kind === "Authenticated") {
            console.log("authenticated");
            const item = await this.authenticatedCartRepository.upsertCartItem(owner.cartId, cartItemDraft);
            console.log("new CartItem after upstert", item);
            return item;
        }
        console.log("********************\nInauthenticatedItemCreation\n********************\n");
        return await this.localCartRepository.upsertCartItem(cartItemDraft);
    }
    async decrementCartItem(cartItemDraft, owner) {
        if (owner.kind === "Authenticated") {
            return await this.authenticatedCartRepository.decrementCartItem(owner.cartId, cartItemDraft);
        }
        return await this.localCartRepository.decrementCartItem(cartItemDraft);
    }
    async removeCartItem(productId, owner) {
        if (owner.kind === "Authenticated") {
            return await this.authenticatedCartRepository.removeCartItem(productId, owner.cartId);
        }
        return await this.localCartRepository.removeCartItem(productId);
    }
    async retrieveSingleCartItem(productId, owner) {
        if (owner.kind === "Authenticated") {
            return await this.authenticatedCartRepository.retrieveSingleCartItem(owner.cartId, productId);
        }
        return await this.localCartRepository.retrieveSingleCartItem(productId);
    }
}

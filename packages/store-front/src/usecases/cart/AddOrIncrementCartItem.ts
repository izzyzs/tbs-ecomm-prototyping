// import InventoryRepository from "@/domain/repositories/InventoryRepository";
import GetCartItem from "./GetCartItemDraft";
import { CartOwner, ProductId, UserId, AuthenticatedCartRepository, CartItemCreationError, CartItem, CartItemDraft, Quantity } from "@tbs/core";
// import { LocalCartRepository } from "@/domain/repositories/cart/LocalCartRepository";
import { CartGateway, DefaultCartGateway } from "@tbs/infra";


export class AddOrIncrementCartItem {
    constructor(
        private getCartItem: GetCartItem,
        // private authenticatedCartRepository: AuthenticatedCartRepository,
        // private localCartRepository: LocalCartRepository,
        private cartGateway: CartGateway
    ) {}

    async execute(productId: ProductId, owner: CartOwner): Promise<CartItem> {
        let cartItemDraft: CartItemDraft
        cartItemDraft = await this.getCartItem.execute(productId, owner);

        const quantity: Quantity = new Quantity(cartItemDraft.quantity.amount + 1);
        const increasedQuantityDraft: CartItemDraft = {...cartItemDraft, quantity}

        const item = await this.cartGateway.addCartItem(increasedQuantityDraft, owner);
        return item;
    }
}
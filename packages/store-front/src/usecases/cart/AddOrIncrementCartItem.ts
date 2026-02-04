// import InventoryRepository from "@/domain/repositories/InventoryRepository";
import GetCartItemDraft from "./GetCartItemDraft";
import { CartOwner, ProductId, UserId, AuthenticatedCartRepository, CartItemCreationError, CartItem, CartItemDraft, Quantity } from "@tbs/core";
// import { LocalCartRepository } from "@/domain/repositories/cart/LocalCartRepository";
import { CartGateway, DefaultCartGateway } from "@tbs/infra";


export class AddOrIncrementCartItem {
    constructor(
        private getCartItemDraft: GetCartItemDraft,
        // private authenticatedCartRepository: AuthenticatedCartRepository,
        // private localCartRepository: LocalCartRepository,
        private cartGateway: CartGateway
    ) {}

    async execute(productId: ProductId, owner: CartOwner): Promise<CartItem> {
        console.log("********************\nfrom inside AddOrIncrementCartItem.execute\n********************\n");
        let cartItemDraft: CartItemDraft
        console.log("attempting to create cartItemDraft with this.getCartItemDraft.execute");
        cartItemDraft = await this.getCartItemDraft.execute(productId, owner);
        console.log("the cartItemDraft retrieved from await this.getCartItemDraft.execute(productId, owner);", cartItemDraft);

        console.log("creating new quantity for cartItemDraft")
        const quantity: Quantity = new Quantity(cartItemDraft.quantity.amount + 1);
        console.log("new quantity", quantity);
        const increasedQuantityDraft: CartItemDraft = {...cartItemDraft, quantity}
        console.log("new draft with increased quantity, increasedQuantityDraft: ", increasedQuantityDraft);

        console.log(`attempting to add increasedQuantityDraft ${JSON.stringify(increasedQuantityDraft)} with this.cartGateway.addCartItem(increasedQuantityDraft, owner)`);
        const item = await this.cartGateway.addCartItem(increasedQuantityDraft, owner);
        // console.log("the item about to add:", item);

        console.log("********************\nend of AddOrIncrementCartItem.execute\n********************\n");
        return item;
    }
}
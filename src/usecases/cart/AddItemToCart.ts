// import InventoryRepository from "@/domain/repositories/InventoryRepository";
import GetCartItem from "./GetCartItem";
import { CartOwner, ProductId, UserId } from "@/domain/identity";
import { AuthenticatedCartRepository, CartItemCreationError } from "@/domain/repositories/cart/AuthenticatedCartRepository";
import { CartItem, CartItemDraft } from "@/domain/cart/cart-item";
// import { LocalCartRepository } from "@/domain/repositories/cart/LocalCartRepository";
import { CartGateway, DefaultCartGateway } from "@/infrastructure/cart/CartGateway";
import { Quantity } from "@/domain/quantity";

export class AddItemToCart {
    constructor(
        private getCartItem: GetCartItem,
        // private authenticatedCartRepository: AuthenticatedCartRepository,
        // private localCartRepository: LocalCartRepository,
        private cartGateway: CartGateway
    ) {}

    async execute(productId: ProductId, owner: CartOwner): Promise<CartItem> {
        let cartItemDraft = await this.getCartItem.execute(productId);

        const quantity: Quantity = new Quantity(cartItemDraft.quantity.amount + 1);
        const increasedQuantityDraft: CartItemDraft = {...cartItemDraft, quantity}

        if (!cartItemDraft) {
            throw new CartItemCreationError("Cart item not couldn't be created.");
        }

        const item = this.cartGateway.addCartItem(increasedQuantityDraft, owner);
        return item;
    }
}
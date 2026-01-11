import { LocalCartRepository } from "@/domain/repositories/cart/LocalCartRepository";
import { AuthenticatedCartRepository } from "@/domain/repositories/cart/AuthenticatedCartRepository";
import { CartItem, CartItemDraft } from "@/domain/cart/cart-item";
import { CartOwner } from "@/domain/identity";
import { CartItemDetails } from "@/domain/repositories/inventory/InventoryRepository";

export interface CartGateway {
    addCartItem(cartItemDraft: CartItemDraft, owner: CartOwner): Promise<CartItem>
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
}
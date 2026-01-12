import { Cart } from "@/core/domain/cart/cart";
import { CartItem, CartItemDraft, CartItemNotFoundError, ProductUnavailableError } from "@/core/domain/cart/cart-item";
import { UserId, ProductId, CartOwner } from "@/core/domain/identity";
import { CreateCartItemDraft } from "./CreateCartItemDraft";
import CartItemMapper from "@/core/interface-adapters/mappers/cart-item.mapper";
import { CartGateway } from "@/core/infrastructure/cart/CartGateway";
import { SupabaseError } from "@/core/infrastructure/cart/Errors";

class GetCartItemDraft {
    constructor(
        private cartGateway: CartGateway,
        private createCartItemDraft: CreateCartItemDraft
    ) {}

    async execute(productId: ProductId, owner: CartOwner): Promise<CartItemDraft> {
        console.log("start of GetCartItemDraft execution")
        let retrievedItem: CartItem;
        try {
            retrievedItem = await this.cartGateway.retrieveSingleCartItem(productId, owner);
            if (retrievedItem) return CartItemMapper.toDraftFromDomain(retrievedItem);
        } catch (error) {
            if (!(error instanceof CartItemNotFoundError) && !(error instanceof SupabaseError)) {
                throw error;
            }
        }

        const created = await this.createCartItemDraft.execute(productId)
        if (!created) {
            throw new ProductUnavailableError("the product is unavailable.")
        }
        console.log("end of GetCartItemDraft execution")
        return created;
    }
}

export default GetCartItemDraft;
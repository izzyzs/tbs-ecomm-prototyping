import {
    Cart,
    CartItem,
    CartItemDraft,
    CartItemNotFoundError,
    ProductUnavailableError,
    UserId,
    ProductId,
    CartOwner
} from "@tbs/core";
import { CreateCartItemDraft } from "./CreateCartItemDraft";
import { CartItemMapper } from "@tbs/adapters";
import { CartGateway } from "@tbs/infra";
import { SupabaseError } from "@tbs/infra";

class GetCartItemDraft {
    constructor(
        private cartGateway: CartGateway,
        private createCartItemDraft: CreateCartItemDraft
    ) {}

    async execute(productId: ProductId, owner: CartOwner): Promise<CartItemDraft> {
        console.log("start of GetCartItemDraft execution")
        let retrievedItem: CartItem
        try {
            retrievedItem = await this.cartGateway.retrieveSingleCartItem(productId, owner);
            if (retrievedItem) return CartItemMapper.toDraftFromDomain(retrievedItem);
        } catch (e) {
            if (!(e instanceof CartItemNotFoundError)) {
                throw e;
            }
            console.log(`${e.name}: ${e.message}`);
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
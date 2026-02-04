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
        console.log("********************\nStart of GetCartItemDraft.execute\n********************\n");
        let retrievedItem: CartItem
        try {
            console.log("attempting to retrieve item...");
            retrievedItem = await this.cartGateway.retrieveSingleCartItem(productId, owner);
            if (retrievedItem) {
                console.log("item successfully retrieved:", retrievedItem);
                const draft = CartItemMapper.toDraftFromDomain(retrievedItem);
                console.log("that item as a draft:", draft);
                console.log("********************\nEnd of GetCartItemDraft.execute, returning retrieved draft\n********************\n");
                return draft;
            }
        } catch (e) {
            if (!(e instanceof CartItemNotFoundError)) {
                throw e;
            } else {
                console.log(`recieved error, ${e.name}: ${e.message}`);
            }
        }

        console.log("item not retrieved, attempting to create cart item draft with this.createCartItemDraft.execute(productId)");
        const created = await this.createCartItemDraft.execute(productId)
        if (!created) {
            throw new ProductUnavailableError("the product is unavailable.")
        }
        console.log("created output from\nthis.createCartItemDraft.execute(productId) in above Function ^^^^^^^", created)
                console.log("********************\nEnd of GetCartItemDraft.execute, returning created\n********************\n");
        return created;
    }
}

export default GetCartItemDraft;
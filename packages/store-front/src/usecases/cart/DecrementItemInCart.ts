import { CartItem, CartItemDraft } from "@tbs/core";
import { CartItemId, CartOwner, ProductId } from "@tbs/core";
import { Quantity } from "@tbs/core";
import { CartGateway } from "@tbs/infra";
import { CartItemMapper } from "@tbs/adapters";


export class DecrementItemInCart {
    constructor(private cartGateway: CartGateway) {}

    async execute(productId: ProductId, owner: CartOwner): Promise<CartItem> {
        const cartItem = await this.cartGateway.retrieveSingleCartItem(productId, owner);

        if (cartItem.quantityAmount == 1) {
            await this.cartGateway.removeCartItem(cartItem.productId, owner);
            return new CartItem(cartItem.id, cartItem.productId, cartItem.name, cartItem.brand, cartItem.price, new Quantity(0));
        }

        const oldItem = CartItemMapper.toDraftFromDomain(cartItem)
        const quantity = new Quantity(cartItem.quantityAmount - 1)
        const decreasedQuantityDraft: CartItemDraft = { ...oldItem,  quantity }

        const decrementedCartItem = await this.cartGateway.decrementCartItem(decreasedQuantityDraft, owner);
        return decrementedCartItem;
    }
}
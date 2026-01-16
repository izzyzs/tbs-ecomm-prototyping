import { CartItemState } from "../types/index.js";
import { CartItem, CartItemId, ProductId, Money, Quantity } from "@tbs/core";

export class CartItemStateMapper {
    static toStateFromDomain(item: CartItem): CartItemState {
        const itemState: CartItemState = {
            id: item.id.number,
            productId: item.productId.number,
            name: item.name,
            brand: item.brand,
            price: item.price.inDollars,
            quantity: item.quantityAmount,
        };

        return itemState;
    }

    static toDomainFromState(itemState: CartItemState): CartItem {
        const priceInPennies = itemState.price * 100;

        const item: CartItem = new CartItem(
            new CartItemId(itemState.id),
            new ProductId(itemState.productId),
            itemState.name,
            itemState.brand,
            new Money(priceInPennies),
            new Quantity(itemState.quantity)
        );

        return item;
    }
}
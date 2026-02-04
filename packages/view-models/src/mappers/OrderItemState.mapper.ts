import {Money, OrderItem, OrderItemId, Quantity, SKU} from "@tbs/core";
import {OrderItemState} from "../types/index.js";

export class OrderItemStateMapper {
    static domainToState(item: OrderItem): OrderItemState {
        return {
            id: item.id.number,
            productName: item.productName,
            sku: item.sku.value,
            unitPrice: item.unitPrice.inDollars,
            quantity: item.quantity.amount,
        }
    }

    static stateToDomain(state: OrderItemState): OrderItem {
        return new OrderItem(
            new OrderItemId(state.id),
            state.productName,
            new SKU(state.sku),
            new Money(state.unitPrice),
            new Quantity(state.quantity)
        )
    }
}
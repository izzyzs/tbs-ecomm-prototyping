import { createOptionalInstant, createOptionalInstantString, Order, OrderId, StripeCheckoutId } from "@tbs/core";
import { OrderItemStateMapper } from "./OrderItemState.mapper.js";
import { Temporal } from "@js-temporal/polyfill";
export class OrderStateMapper {
    static domainToState(order) {
        return {
            orderId: order.id.number,
            stripeId: order.stripeId.value,
            createdAt: order.createdAt.toString(),
            paidAt: order.paidAt.toString(),
            preparedAt: createOptionalInstantString(order.preparedAt),
            readyAt: createOptionalInstantString(order.readyAt),
            pickedUpAt: createOptionalInstantString(order.pickedUpAt),
            orderItems: order.orderItems.map((item) => OrderItemStateMapper.domainToState(item)),
        };
    }
    static stateToDomain(state, userId) {
        return new Order(new OrderId(state.orderId), userId, new StripeCheckoutId(state.stripeId), Temporal.Instant.from(state.createdAt), Temporal.Instant.from(state.paidAt), createOptionalInstant(state.preparedAt), createOptionalInstant(state.readyAt), createOptionalInstant(state.pickedUpAt), state.orderItems.map((state) => OrderItemStateMapper.stateToDomain(state)));
    }
}

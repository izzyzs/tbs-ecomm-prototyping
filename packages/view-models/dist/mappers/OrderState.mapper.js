import { Order, OrderId } from "@tbs/core";
import { OrderItemStateMapper } from "./OrderItemState.mapper.js";
export class OrderStateMapper {
    static domainToState(order) {
        return {
            orderId: order.id.number,
            createdAt: order.createdAt,
            preparedAt: order.preparedAt,
            readyAt: order.readyAt,
            orderItems: order.orderItems.map((item) => OrderItemStateMapper.domainToState(item)),
        };
    }
    static stateToDomain(state, userId) {
        return new Order(new OrderId(state.orderId), userId, state.createdAt, state.preparedAt, state.readyAt, state.orderItems.map((state) => OrderItemStateMapper.stateToDomain(state)));
    }
}

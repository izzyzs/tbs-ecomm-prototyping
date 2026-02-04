import {OrderState} from "../types/OrderState.type.js";
import {Order, OrderId, UserId} from "@tbs/core";
import {OrderItemStateMapper} from "./OrderItemState.mapper.js";

export class OrderStateMapper {
    static domainToState(order: Order): OrderState {
        return {
            orderId: order.id.number,
            createdAt: order.createdAt,
            preparedAt: order.preparedAt,
            readyAt: order.readyAt,
            orderItems: order.orderItems.map(
                (item)=>
                    OrderItemStateMapper.domainToState(item)
            ),
        }
    }

    static stateToDomain(state: OrderState, userId: UserId): Order {
        return new Order(
            new OrderId(state.orderId),
            userId,
            state.createdAt,
            state.preparedAt,
            state.readyAt,
            state.orderItems.map(
                (state) =>
                    OrderItemStateMapper.stateToDomain(state)
            )
        )
    }
}
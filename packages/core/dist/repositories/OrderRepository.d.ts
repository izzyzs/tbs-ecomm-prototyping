import { UserId, OrderPrototype, Order, OrderId, OrderItem } from "../entities/index.js";
import { Temporal } from "@js-temporal/polyfill";
export interface OrderRepository {
    createOrder(prototype: OrderPrototype, userId: UserId): Promise<Order>;
    retrieveAllOrders(userId: UserId): Promise<Order[]>;
    retrieveOrderItems(orderId: OrderId): Promise<OrderItem[]>;
    updateOrderPreparedAt(time: Temporal.Instant, oId: OrderId): Promise<void>;
    updateOrderReadyAt(time: Temporal.Instant, oId: OrderId): Promise<void>;
}
//# sourceMappingURL=OrderRepository.d.ts.map
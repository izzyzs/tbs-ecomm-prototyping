import { UserId, OrderPrototype, Order, OrderId, OrderItem } from "../entities/index.js";
import { Temporal } from "@js-temporal/polyfill";
export interface OrderRepository {
    createOrder(prototype: OrderPrototype): Promise<Order>;
    retrieveAllUserOrders(userId: UserId): Promise<Order[]>;
    retrieveAllOrders(userId: UserId): Promise<Order[]>;
    retrieveOrderItems(orderId: OrderId): Promise<OrderItem[]>;
    retrieveSingleOrder(orderId: OrderId): Promise<Order | null>;
    updateOrderPreparedAt(time: Temporal.Instant, oId: OrderId): Promise<Temporal.Instant>;
    updateOrderReadyAt(time: Temporal.Instant, oId: OrderId): Promise<Temporal.Instant>;
}
//# sourceMappingURL=OrderRepository.d.ts.map
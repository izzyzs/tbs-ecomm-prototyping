import {UserId, OrderPrototype, Order, OrderId, OrderItem} from "../entities/index.js";
import { Temporal } from "@js-temporal/polyfill";

export interface OrderRepository {
    createOrder(prototype: OrderPrototype, userId: UserId): Promise<Order>
    // the above method should create an 'orders' entry and
    // ant the coresponding 'order_items'
    retrieveAllOrders(userId: UserId): Promise<Order[]>
    retrieveOrderItems(orderId: OrderId): Promise<OrderItem[]>
    // retrieveSingleOrder(userId: UserId): Promise<Order>
    updateOrderPreparedAt(time: Temporal.Instant, oId: OrderId): Promise<void>
    updateOrderReadyAt(time: Temporal.Instant, oId: OrderId): Promise<void>
}
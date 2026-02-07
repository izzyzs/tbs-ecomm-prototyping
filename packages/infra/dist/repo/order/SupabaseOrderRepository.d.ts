import { Order, OrderId, OrderItem, OrderPrototype, OrderRepository, UserId } from "@tbs/core";
import { Temporal } from "@js-temporal/polyfill";
import { client } from "../../lib/index.js";
export declare class SupabaseOrderRepository implements OrderRepository {
    private supabase;
    constructor(supabase: client.BrowserSupabaseClient);
    createOrder(prototype: OrderPrototype): Promise<Order>;
    retrieveAllOrders(userId: UserId): Promise<Order[]>;
    retrieveOrderItems(orderId: OrderId): Promise<OrderItem[]>;
    updateOrderPreparedAt(time: Temporal.Instant, oId: OrderId): Promise<void>;
    updateOrderReadyAt(time: Temporal.Instant, oId: OrderId): Promise<void>;
}
//# sourceMappingURL=SupabaseOrderRepository.d.ts.map
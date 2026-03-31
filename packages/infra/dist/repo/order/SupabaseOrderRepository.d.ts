import { Order, OrderId, OrderItem, OrderPrototype, OrderRepository, UserId } from "@tbs/core";
import { Temporal } from "@js-temporal/polyfill";
import { client } from "../../lib/index.js";
export declare class SupabaseOrderRepository implements OrderRepository {
    private supabase;
    constructor(supabase: client.BrowserSupabaseClient);
    createOrder(prototype: OrderPrototype): Promise<Order>;
    retrieveSingleOrder(orderId: OrderId): Promise<Order | null>;
    retrieveAllUserOrders(userId: UserId): Promise<Order[]>;
    retrieveAllOrders(): Promise<Order[]>;
    retrieveOrderItems(orderId: OrderId): Promise<OrderItem[]>;
    updateOrderPreparedAt(time: Temporal.Instant, oId: OrderId): Promise<Temporal.Instant>;
    updateOrderReadyAt(time: Temporal.Instant, oId: OrderId): Promise<Temporal.Instant>;
    updateOrderPickedUpAt(time: Temporal.Instant, oId: OrderId): Promise<Temporal.Instant>;
}
//# sourceMappingURL=SupabaseOrderRepository.d.ts.map
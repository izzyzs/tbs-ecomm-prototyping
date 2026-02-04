import {
    createOptionalInstant,
    Money,
    Order,
    OrderId,
    OrderItem,
    OrderItemId,
    OrderItemPrototype,
    OrderPrototype,
    OrderRepository, Quantity, SKU,
    UserId
} from "@tbs/core";
import {Temporal} from "@js-temporal/polyfill";
import {client, Database} from "../../lib/index.js";

type OrderItemRow = Database["public"]["Tables"]["order_items"]["Row"]

export class SupabaseOrderRepository implements OrderRepository {
    constructor(private supabase: client.BrowserSupabaseClient) {}

    async createOrder(prototype: OrderPrototype, userId: UserId): Promise<Order> {
        const { data: orderData, error: orderError } = await this.supabase.from('orders').insert({user_id: userId.value}).select().single();
        if (orderError) throw orderError;
        if (!orderData) throw new Error("SupbaseOrderRepository.createOrder(): orderData not found");
        const itemRows = prototype.OrderItemPrototypeList.map((item: OrderItemPrototype) => ({
            order_id: orderData.id,
            product_name: item.productName,
            sku: item.sku,
            unit_price_cents: item.unitPrice.valueInPennies,
            quantity: item.quantity.amount,
        }))
        const { data: insertedOrderItems, error: insertOrderItemError } = await this.supabase.from('order_items').insert(itemRows).select();
        if (insertOrderItemError) throw insertOrderItemError;
        if (!insertedOrderItems) throw new Error("SupbaseOrderRepository.createOrder(): insertedOrderItems not found");

        const orderItems = insertedOrderItems.map((item: OrderItemRow) => {
            return new OrderItem(
                new OrderItemId(item.id),
                item.product_name,
                new SKU(item.sku),
                new Money(item.unit_price_cents),
                new Quantity(item.quantity),
            )
        })

        return new Order(
            new OrderId(orderData.id),
            new UserId(orderData.user_id),
            Temporal.Instant.from(orderData.created_at),
            null,
            null,
            orderItems,
        )
    }
    // the above method should create an 'orders' entry and
    // ant the coresponding 'order_items'
    async retrieveAllOrders(userId: UserId): Promise<Order[]> {
        const { data: allOrderData, error: orderError } = await this.supabase.from('orders').select("*").eq("user_id", userId.value);
        if (orderError) throw orderError;
        if (!allOrderData) throw new Error("SupbaseOrderRepository.retrieveAllOrders(): allOrderData not found");

        let orders: Order[] = [];

        for (const orderData of allOrderData) {
            const orderItems = await this.retrieveOrderItems(new OrderId(orderData.id))

            orders.push(new Order(new OrderId(orderData.id), new UserId(orderData.user_id), Temporal.Instant.from(orderData.created_at), createOptionalInstant(orderData.prepared_at), createOptionalInstant(orderData.ready_at), orderItems))
        }
        return orders;
    }

    async retrieveOrderItems(orderId: OrderId): Promise<OrderItem[]> {
        const {data: orderItemsData, error: orderItemError } = await this.supabase.from('order_items').select("*").eq("order_id", orderId.number).select();
        if (orderItemError) throw orderItemError;
        if (!orderItemsData) throw new Error(`SupbaseOrderRepository.retrieveAllOrders(): orderItemsData not found for order ${orderId.number}`);
        const orderItems = orderItemsData.map((item: OrderItemRow) => new OrderItem(
            new OrderItemId(item.id),
            item.product_name,
            new SKU(item.sku),
            new Money(item.unit_price_cents),
            new Quantity(item.quantity),
        ));
        return orderItems;
    }
    // async retrieveSingleOrder(userId: UserId): Promise<Order> {
    //
    // }
    async updateOrderPreparedAt(time: Temporal.Instant, oId: OrderId): Promise<void> {
        const timeString = time.toString();
        const { data, error } = await this.supabase.from('orders').update({ prepared_at: timeString }).eq("order_id", oId.number).select().single();
        if (error) throw error;
    }

    async updateOrderReadyAt(time: Temporal.Instant, oId: OrderId): Promise<void> {
        const timeString = time.toString();
        const { data, error } = await this.supabase.from('orders').update({ ready_at: timeString }).eq("order_id", oId.number).select().single();
        if (error) throw error;
    }
}
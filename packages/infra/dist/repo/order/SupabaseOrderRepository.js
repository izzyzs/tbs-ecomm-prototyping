import { createOptionalInstant, Money, Order, OrderId, OrderItem, OrderItemId, Quantity, SKU, StripeCheckoutId, UserId } from "@tbs/core";
import { Temporal } from "@js-temporal/polyfill";
export class SupabaseOrderRepository {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async createOrder(prototype) {
        const { data: orderData, error: orderError } = await this.supabase.from('orders').insert({ user_id: prototype.userId.value, stripe_checkout_id: prototype.stripeId.value, stripe_paid_at: prototype.paidAt.toString() }).select().single();
        if (orderError)
            throw orderError;
        if (!orderData)
            throw new Error("SupbaseOrderRepository.createOrder(): orderData not found");
        const itemRows = prototype.orderItemPrototypeList.map((item) => ({
            order_id: orderData.id,
            product_name: item.productName,
            sku: item.sku.value,
            unit_price_cents: item.unitPrice.valueInPennies,
            quantity: item.quantity.amount,
        }));
        const { data: insertedOrderItems, error: insertOrderItemError } = await this.supabase.from('order_items').insert(itemRows).select();
        if (insertOrderItemError)
            throw insertOrderItemError;
        if (!insertedOrderItems)
            throw new Error("SupbaseOrderRepository.createOrder(): insertedOrderItems not found");
        const orderItems = insertedOrderItems.map((item) => {
            return new OrderItem(new OrderItemId(item.id), item.product_name, new SKU(item.sku), new Money(item.unit_price_cents), new Quantity(item.quantity));
        });
        return new Order(new OrderId(orderData.id), new UserId(orderData.user_id), new StripeCheckoutId(orderData.stripe_checkout_id), Temporal.Instant.from(orderData.created_at), Temporal.Instant.from(orderData.stripe_paid_at), createOptionalInstant(orderData.prepared_at), createOptionalInstant(orderData.ready_at), createOptionalInstant(orderData.picked_up_at), orderItems);
    }
    async retrieveSingleOrder(orderId) {
        const { data: orderData, error } = await this.supabase.from("orders").select("*").eq("id", orderId.number).single();
        if (error)
            throw error;
        if (!orderData)
            return null;
        const orderItems = await this.retrieveOrderItems(orderId);
        return new Order(new OrderId(orderData.id), new UserId(orderData.user_id), new StripeCheckoutId(orderData.stripe_checkout_id), Temporal.Instant.from(orderData.created_at), Temporal.Instant.from(orderData.stripe_paid_at), createOptionalInstant(orderData.prepared_at), createOptionalInstant(orderData.ready_at), createOptionalInstant(orderData.picked_up_at), orderItems);
    }
    // the above method should create an 'orders' entry and
    // ant the coresponding 'order_items'
    async retrieveAllUserOrders(userId) {
        const { data: allOrderData, error: orderError } = await this.supabase.from('orders').select("*").eq("user_id", userId.value);
        if (orderError)
            throw orderError;
        if (!allOrderData)
            throw new Error("SupbaseOrderRepository.retrieveAllOrders(): allOrderData not found");
        let orders = [];
        for (const orderData of allOrderData) {
            const orderItems = await this.retrieveOrderItems(new OrderId(orderData.id));
            orders.push(new Order(new OrderId(orderData.id), new UserId(orderData.user_id), new StripeCheckoutId(orderData.stripe_checkout_id), Temporal.Instant.from(orderData.created_at), Temporal.Instant.from(orderData.stripe_paid_at), createOptionalInstant(orderData.prepared_at), createOptionalInstant(orderData.ready_at), createOptionalInstant(orderData.picked_up_at), orderItems));
        }
        return orders;
    }
    async retrieveAllOrders() {
        const { data: allOrderData, error: orderError } = await this.supabase.from('orders').select("*");
        if (orderError)
            throw orderError;
        if (!allOrderData)
            throw new Error("SupbaseOrderRepository.retrieveAllOrders(): allOrderData not found");
        let orders = [];
        for (const orderData of allOrderData) {
            const orderItems = await this.retrieveOrderItems(new OrderId(orderData.id));
            orders.push(new Order(new OrderId(orderData.id), new UserId(orderData.user_id), new StripeCheckoutId(orderData.stripe_checkout_id), Temporal.Instant.from(orderData.created_at), Temporal.Instant.from(orderData.stripe_paid_at), createOptionalInstant(orderData.prepared_at), createOptionalInstant(orderData.ready_at), createOptionalInstant(orderData.picked_up_at), orderItems));
        }
        return orders;
    }
    async retrieveOrderItems(orderId) {
        const { data: orderItemsData, error: orderItemError } = await this.supabase.from('order_items').select("*").eq("order_id", orderId.number).select();
        if (orderItemError)
            throw orderItemError;
        if (!orderItemsData)
            throw new Error(`SupbaseOrderRepository.retrieveAllOrders(): orderItemsData not found for order ${orderId.number}`);
        const orderItems = orderItemsData.map((item) => new OrderItem(new OrderItemId(item.id), item.product_name, new SKU(item.sku), new Money(item.unit_price_cents), new Quantity(item.quantity)));
        return orderItems;
    }
    // async retrieveSingleOrder(userId: UserId): Promise<Order> {
    //
    // }
    async updateOrderPreparedAt(time, oId) {
        const timeString = time.toString();
        const { data, error } = await this.supabase.from('orders').update({ prepared_at: timeString }).eq("id", oId.number).select("prepared_at").single();
        if (error) {
            console.error(error);
            throw error;
        }
        if (!data.prepared_at)
            throw new Error("Prepared time not added to DB");
        return Temporal.Instant.from(data.prepared_at);
    }
    async updateOrderReadyAt(time, oId) {
        const timeString = time.toString();
        const { data, error } = await this.supabase.from('orders').update({ ready_at: timeString }).eq("id", oId.number).select("ready_at").single();
        if (error)
            throw error;
        if (!data.ready_at)
            throw new Error("Ready time not added to DB");
        return Temporal.Instant.from(data.ready_at);
    }
    async updateOrderPickedUpAt(time, oId) {
        const timeString = time.toString();
        const { data, error } = await this.supabase.from('orders').update({ picked_up_at: timeString }).eq("id", oId.number).select("picked_up_at").single();
        if (error)
            throw error;
        if (!data.picked_up_at)
            throw new Error("Ready time not added to DB");
        return Temporal.Instant.from(data.picked_up_at);
    }
}

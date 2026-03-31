import { Money, Quantity, SKU, StripeCheckoutId, UserId } from "../../entities/index.js";
import { OrderId, OrderItemId } from "../../entities/Identity.js";
import { Temporal } from "@js-temporal/polyfill";
export declare class Order {
    id: OrderId;
    userId: UserId;
    stripeId: StripeCheckoutId;
    createdAt: Temporal.Instant;
    paidAt: Temporal.Instant;
    preparedAt: Temporal.Instant | null;
    readyAt: Temporal.Instant | null;
    pickedUpAt: Temporal.Instant | null;
    orderItems: OrderItem[];
    constructor(id: OrderId, userId: UserId, stripeId: StripeCheckoutId, createdAt: Temporal.Instant, paidAt: Temporal.Instant, preparedAt: Temporal.Instant | null, readyAt: Temporal.Instant | null, pickedUpAt: Temporal.Instant | null, orderItems: OrderItem[]);
}
export type Status = "Created" | "Prepared" | "Ready for pickup" | "Picked up";
export declare class OrderItem {
    id: OrderItemId;
    productName: string;
    sku: SKU;
    unitPrice: Money;
    quantity: Quantity;
    constructor(id: OrderItemId, productName: string, sku: SKU, unitPrice: Money, quantity: Quantity);
}
export type OrderItemPrototype = {
    productName: string;
    sku: SKU;
    unitPrice: Money;
    quantity: Quantity;
};
export type OrderPrototype = {
    userId: UserId;
    paidAt: Temporal.Instant;
    stripeId: StripeCheckoutId;
    orderItemPrototypeList: OrderItemPrototype[];
};
export declare function createOptionalInstant(val: string | null): Temporal.Instant | null;
export declare function createOptionalInstantString(val: Temporal.Instant | null): string | null;
//# sourceMappingURL=Order.d.ts.map
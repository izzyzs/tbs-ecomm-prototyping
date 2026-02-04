import { Money, Quantity, SKU, UserId } from "../../entities/index.js";
import { OrderId, OrderItemId } from "../../entities/Identity.js";
import { Temporal } from "@js-temporal/polyfill";
export declare class Order {
    id: OrderId;
    userId: UserId;
    createdAt: Temporal.Instant;
    preparedAt: Temporal.Instant | null;
    readyAt: Temporal.Instant | null;
    orderItems: OrderItem[];
    constructor(id: OrderId, userId: UserId, createdAt: Temporal.Instant, preparedAt: Temporal.Instant | null, readyAt: Temporal.Instant | null, orderItems: OrderItem[]);
}
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
    sku: string;
    unitPrice: Money;
    quantity: Quantity;
};
export type OrderPrototype = {
    userId: UserId;
    OrderItemPrototypeList: OrderItemPrototype[];
};
export declare function createOptionalInstant(val: string | null): Temporal.Instant | null;
//# sourceMappingURL=Order.d.ts.map
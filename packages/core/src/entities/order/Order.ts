import {Money, Quantity, SKU, UserId} from "../../entities/index.js";
import { OrderId, OrderItemId } from "../../entities/Identity.js"
import { Temporal } from "@js-temporal/polyfill";

export class Order {
    constructor (
        public id: OrderId,
        public userId: UserId,
        public createdAt: Temporal.Instant,
        public preparedAt: Temporal.Instant | null,
        public readyAt: Temporal.Instant | null,
        public orderItems: OrderItem[]
    ) {}
}

export class OrderItem {
    constructor (
        public id: OrderItemId,
        public productName: string,
        public sku: SKU,
        public unitPrice: Money,
        public quantity: Quantity
    ) {}
}
export type OrderItemPrototype = { productName: string, sku: string, unitPrice: Money, quantity: Quantity };

export type OrderPrototype = {
    userId: UserId;
    OrderItemPrototypeList: OrderItemPrototype[];
}

export function createOptionalInstant(val: string | null) : Temporal.Instant | null {
    if (!val) {
        return null;
    }
    return Temporal.Instant.from(val);
}
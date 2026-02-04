import { Temporal } from "@js-temporal/polyfill";
export class Order {
    constructor(id, userId, createdAt, preparedAt, readyAt, orderItems) {
        this.id = id;
        this.userId = userId;
        this.createdAt = createdAt;
        this.preparedAt = preparedAt;
        this.readyAt = readyAt;
        this.orderItems = orderItems;
    }
}
export class OrderItem {
    constructor(id, productName, sku, unitPrice, quantity) {
        this.id = id;
        this.productName = productName;
        this.sku = sku;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
    }
}
export function createOptionalInstant(val) {
    if (!val) {
        return null;
    }
    return Temporal.Instant.from(val);
}

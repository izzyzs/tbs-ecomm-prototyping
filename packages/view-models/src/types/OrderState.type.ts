import {Temporal} from "@js-temporal/polyfill";
import {OrderItemState} from "./OrderItemState.type.js";

export interface OrderState {
    orderId: number;
    createdAt: Temporal.Instant;
    preparedAt: Temporal.Instant | null;
    readyAt: Temporal.Instant | null;
    orderItems: OrderItemState[];
}
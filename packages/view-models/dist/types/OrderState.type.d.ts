import { Temporal } from "@js-temporal/polyfill";
import { OrderItemState } from "./OrderItemState.type.js";
import { Status } from "@tbs/core";
export interface OrderState {
    orderId: number;
    stripeId: string;
    createdAt: string;
    paidAt: string;
    preparedAt: string | null;
    readyAt: string | null;
    pickedUpAt: string | null;
    orderItems: OrderItemState[];
}
export declare function getOrderStatus(order: OrderState): Status;
export declare function formatInstant(instant: Temporal.Instant | null | undefined): string;
export declare function formatRealtimeStamp(timestamp: string): string;
//# sourceMappingURL=OrderState.type.d.ts.map
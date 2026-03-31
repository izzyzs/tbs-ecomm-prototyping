import {Temporal} from "@js-temporal/polyfill";
import {OrderItemState} from "./OrderItemState.type.js";

import React from "react";
import {Status} from "@tbs/core";

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

export function getOrderStatus(order: OrderState): Status {
    return order.pickedUpAt ? "Picked up" : order.readyAt ? "Ready for pickup" : order.preparedAt ? "Prepared" : "Created";
}

export function formatInstant(instant: Temporal.Instant | null | undefined) {
    if (!instant) return "Not yet updated";

    return instant.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

export function formatRealtimeStamp(timestamp: string) {
    return new Date(timestamp).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
}
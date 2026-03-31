"use client";
import React from "react";
import { createClient } from "@/lib/supabase/client";
import { SupabaseOrderRepository } from "@tbs/infra";
import {createOptionalInstant, Order, OrderId, OrderItem, Status} from "@tbs/core";
import {
    OrderItemStateMapper,
    OrderState,
    OrderItemState,
    OrderStateMapper,
    formatRealtimeStamp, getOrderStatus, formatInstant
} from "@tbs/view-models";
import { Temporal } from "@js-temporal/polyfill";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Clock3, Package, RadioTower } from "lucide-react";

type Payload<T> = { schema: string; table: string; commit_tablestamp: string; eventType: string; new: T; old: T; errors: unknown };


const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

const statusStyles: Record<Status, string> = {
    Created: "border-slate-200 bg-slate-100 text-slate-700",
    Prepared: "border-amber-200 bg-amber-100 text-amber-800",
    "Ready for pickup": "border-emerald-200 bg-emerald-100 text-emerald-800",
    "Picked up": "border-violet-200 bg-violet-100 text-violet-800",
};

export default function OrdersPage() {
    const supabase = React.useMemo(() => createClient(), []);
    // @ts-expect-error: annoying issue with supabase typing.
    const orderRepository = React.useMemo(() => new SupabaseOrderRepository(supabase), [supabase]);
    const [orders, setOrders] = React.useState<OrderState[]>([]);
    const [event, setEvent] = React.useState<Payload<{ [key: string]: never }>>();
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const initialLoad = async () => {
            try {
                const previousOrders: Order[] = await orderRepository.retrieveAllOrders();
                const orderState = previousOrders.map((order) => OrderStateMapper.domainToState(order));
                setOrders(orderState);
            } finally {
                setIsLoading(false);
            }
        };
        void initialLoad();
    }, [orderRepository]);

    React.useEffect(() => {
        const channelA = supabase
            .channel("schema-db-changes")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "orders",
                },
                (payload) => {
                    setEvent(payload as unknown as Payload<{ [key: string]: never }>);
                },
            )
            .subscribe();

        return () => {
            void channelA.unsubscribe();
        };
    }, [supabase]);

    React.useEffect(() => {
        const getOrderItems = async () => {
            if (event && event.eventType === "INSERT") {
                const items = await orderRepository.retrieveOrderItems(new OrderId(event.new.id));
                const itemsState = items.map((item: OrderItem) => OrderItemStateMapper.domainToState(item));
                const newOrder: OrderState = {
                    orderId: event.new.id,
                    stripeId: event.new.stripe_checkout_id,
                    createdAt: event.new.created_at,
                    paidAt: event.new.stripe_paid_at,
                    preparedAt: event.new.prepared_at,
                    readyAt: event.new.ready_at,
                    pickedUpAt: event.new.picked_at,
                    orderItems: itemsState,
                };
                setOrders((prev) => [...prev, newOrder]);
                setEvent(undefined);
            }
        };
        void getOrderItems();
    }, [event, orderRepository]);

    const totalOrders = orders.length;
    const activeOrders = orders.filter((order) => !order.pickedUpAt).length;
    const readyOrders = orders.filter((order) => order.readyAt && !order.pickedUpAt).length;

    return (
        <div className="min-h-screen bg-muted/20 p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                <section className="rounded-3xl border bg-background p-6 shadow-sm">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="space-y-3">
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Operations</p>
                            <div className="space-y-2">
                                <h1 className="text-4xl font-semibold tracking-tight text-foreground">Orders</h1>
                                <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
                                    Review every incoming order, track its progress through fulfillment, and open any order for item-level and customer details.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-2xl border bg-muted/30 p-4 text-sm">
                            <div className="flex items-center gap-2 font-medium text-foreground">
                                <RadioTower className="size-4" />
                                Realtime updates
                            </div>
                            <p className="mt-2 text-muted-foreground">
                                {event ? `Last event: ${event.eventType} on ${formatRealtimeStamp(event.commit_tablestamp)}` : "Listening for new order activity."}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border bg-muted/30 p-4">
                            <p className="text-sm text-muted-foreground">Total orders</p>
                            <p className="mt-2 text-3xl font-semibold text-foreground">{totalOrders}</p>
                        </div>
                        <div className="rounded-2xl border bg-muted/30 p-4">
                            <p className="text-sm text-muted-foreground">Active fulfillment</p>
                            <p className="mt-2 text-3xl font-semibold text-foreground">{activeOrders}</p>
                        </div>
                        <div className="rounded-2xl border bg-muted/30 p-4">
                            <p className="text-sm text-muted-foreground">Ready for pickup</p>
                            <p className="mt-2 text-3xl font-semibold text-foreground">{readyOrders}</p>
                        </div>
                    </div>
                </section>

                {isLoading ? (
                    <div className="grid gap-5 xl:grid-cols-2">
                        {Array.from({ length: 4 }, (_, index) => (
                            <div key={index} className="rounded-3xl border bg-background p-5 shadow-sm">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-3">
                                        <Skeleton className="h-7 w-36 rounded-full" />
                                        <Skeleton className="h-4 w-44 rounded-full" />
                                    </div>
                                    <Skeleton className="h-7 w-28 rounded-full" />
                                </div>
                                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                    <Skeleton className="h-20 rounded-2xl" />
                                    <Skeleton className="h-20 rounded-2xl" />
                                    <Skeleton className="h-20 rounded-2xl" />
                                    <Skeleton className="h-20 rounded-2xl" />
                                </div>
                                <div className="mt-6 space-y-3">
                                    <Skeleton className="h-16 rounded-2xl" />
                                    <Skeleton className="h-16 rounded-2xl" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="rounded-3xl border border-dashed bg-background p-12 text-center shadow-sm">
                        <div className="mx-auto flex max-w-md flex-col items-center gap-4">
                            <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                                <Package className="size-6" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-semibold tracking-tight text-foreground">No orders yet</h2>
                                <p className="text-sm text-muted-foreground">New orders will appear here as soon as checkout activity reaches the dashboard.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-5 xl:grid-cols-2">
                        {orders.map((orderState: OrderState) => {
                            const status = getOrderStatus(orderState);
                            const totalItems = orderState.orderItems.reduce((sum, item) => sum + item.quantity, 0);
                            const orderTotal = orderState.orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

                            return (
                                <Link
                                    key={orderState.orderId}
                                    href={`/orders/${orderState.orderId}`}
                                    className="group block rounded-3xl border bg-background p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                                <Clock3 className="size-4" />
                                                Paid {formatInstant(Temporal.Instant.from(orderState.paidAt))}
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-semibold tracking-tight text-foreground transition group-hover:text-primary">Order #{orderState.orderId}</h2>
                                                <p className="text-sm text-muted-foreground">
                                                    {totalItems} {totalItems === 1 ? "item" : "items"} · {currencyFormatter.format(orderTotal)}
                                                </p>
                                            </div>
                                        </div>

                                        <span className={cn("inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold", statusStyles[status])}>{status}</span>
                                    </div>

                                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-2xl bg-muted/30 p-4">
                                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Created</p>
                                            <p className="mt-2 text-sm font-medium text-foreground">{   formatInstant(Temporal.Instant.from(orderState.createdAt))}</p>
                                        </div>
                                        <div className="rounded-2xl bg-muted/30 p-4">
                                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Prepared</p>
                                            <p className="mt-2 text-sm font-medium text-foreground">{formatInstant(createOptionalInstant(orderState.preparedAt))}</p>
                                        </div>
                                        <div className="rounded-2xl bg-muted/30 p-4">
                                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Ready</p>
                                            <p className="mt-2 text-sm font-medium text-foreground">{formatInstant(createOptionalInstant(orderState.readyAt))}</p>
                                        </div>
                                        <div className="rounded-2xl bg-muted/30 p-4">
                                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Picked up</p>
                                            <p className="mt-2 text-sm font-medium text-foreground">{formatInstant(createOptionalInstant(orderState.pickedUpAt))}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 rounded-2xl border bg-muted/10 p-4">
                                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Order items</p>
                                        <ul className="mt-3 space-y-3">
                                            {orderState.orderItems.map((item: OrderItemState) => (
                                                <li
                                                    key={`${orderState.orderId}-${item.id}`}
                                                    className="flex flex-col gap-2 rounded-2xl bg-background p-3 sm:flex-row sm:items-center sm:justify-between"
                                                >
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium text-foreground">{item.productName}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Product {item.id} · Quantity {item.quantity}
                                                        </p>
                                                    </div>
                                                    <p className="text-sm font-semibold text-foreground">{currencyFormatter.format(item.unitPrice)} each</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

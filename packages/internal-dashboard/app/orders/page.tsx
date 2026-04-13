"use client";

import React from "react";
import Link from "next/link";
import { Temporal } from "@js-temporal/polyfill";
import { Clock3, Package, RadioTower } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { SupabaseOrderRepository } from "@tbs/infra";
import { createOptionalInstant, Order, OrderId, OrderItem, Status } from "@tbs/core";
import { OrderItemState, OrderItemStateMapper, OrderState, OrderStateMapper, formatInstant, formatRealtimeStamp, getOrderStatus } from "@tbs/view-models";

type Payload<T> = { schema: string; table: string; commit_tablestamp: string; eventType: string; new: T; old: T; errors: unknown };

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

const statusStyles: Record<Status, string> = {
    Created: "border-slate-200 bg-slate-100 text-slate-700",
    Prepared: "border-amber-200 bg-amber-50 text-amber-700",
    "Ready for pickup": "border-emerald-200 bg-emerald-50 text-emerald-700",
    "Picked up": "border-violet-200 bg-violet-50 text-violet-700",
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
        const channel = supabase
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
            void channel.unsubscribe();
        };
    }, [supabase]);

    React.useEffect(() => {
        const getOrderItems = async () => {
            if (event?.eventType !== "INSERT") return;

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
        };

        void getOrderItems();
    }, [event, orderRepository]);

    const totalOrders = orders.length;
    const activeOrders = orders.filter((order) => !order.pickedUpAt).length;
    const readyOrders = orders.filter((order) => order.readyAt && !order.pickedUpAt).length;

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <section className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.4)] backdrop-blur-xl sm:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-3">
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">Fulfillment operations</p>
                        <div className="space-y-2">
                            <h1 className="text-4xl font-semibold tracking-tight text-foreground">Orders</h1>
                            <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                                Review incoming orders, track their current fulfillment stage, and open any order for customer details and item-level actions.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-primary/10 bg-primary/10 p-4 text-sm shadow-sm">
                        <div className="flex items-center gap-2 font-medium text-foreground">
                            <RadioTower className="size-4 text-primary" />
                            Realtime updates
                        </div>
                        <p className="mt-2 text-muted-foreground">
                            {event ? `Last event: ${event.eventType} on ${formatRealtimeStamp(event.commit_tablestamp)}` : "Listening for new order activity."}
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
                        <p className="text-sm text-muted-foreground">Total orders</p>
                        <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{totalOrders}</p>
                    </div>
                    <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
                        <p className="text-sm text-muted-foreground">Active fulfillment</p>
                        <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{activeOrders}</p>
                    </div>
                    <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
                        <p className="text-sm text-muted-foreground">Ready for pickup</p>
                        <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{readyOrders}</p>
                    </div>
                </div>
            </section>

            {isLoading ? (
                <div className="grid gap-5 xl:grid-cols-2">
                    {Array.from({ length: 4 }, (_, index) => (
                        <div key={index} className="rounded-[30px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.4)] backdrop-blur">
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
                <div className="rounded-[32px] border border-dashed border-slate-300 bg-white/75 p-12 text-center shadow-[0_18px_50px_-38px_rgba(15,23,42,0.35)] backdrop-blur">
                    <div className="mx-auto flex max-w-md flex-col items-center gap-4">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Package className="size-6" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold tracking-tight text-foreground">No orders yet</h2>
                            <p className="text-sm leading-7 text-muted-foreground">New orders will appear here as soon as checkout activity reaches the dashboard.</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid gap-5 xl:grid-cols-2">
                    {orders.map((orderState) => {
                        const status = getOrderStatus(orderState);
                        const totalItems = orderState.orderItems.reduce((sum, item) => sum + item.quantity, 0);
                        const orderTotal = orderState.orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

                        return (
                            <Link
                                key={orderState.orderId}
                                href={`/orders/${orderState.orderId}`}
                                className="group block rounded-[30px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.42)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_22px_58px_-34px_rgba(15,23,42,0.42)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                                    {[
                                        { label: "Created", value: formatInstant(Temporal.Instant.from(orderState.createdAt)) },
                                        { label: "Prepared", value: formatInstant(createOptionalInstant(orderState.preparedAt)) },
                                        { label: "Ready", value: formatInstant(createOptionalInstant(orderState.readyAt)) },
                                        { label: "Picked up", value: formatInstant(createOptionalInstant(orderState.pickedUpAt)) },
                                    ].map((entry) => (
                                        <div key={entry.label} className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
                                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{entry.label}</p>
                                            <p className="mt-2 text-sm font-medium text-foreground">{entry.value}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 rounded-[26px] border border-slate-200/70 bg-slate-50/70 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Order items</p>
                                    <ul className="mt-3 space-y-3">
                                        {orderState.orderItems.map((item: OrderItemState) => (
                                            <li
                                                key={`${orderState.orderId}-${item.id}`}
                                                className="flex flex-col gap-2 rounded-[20px] border border-white/80 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between"
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
    );
}

"use client";

import React from "react";
import Link from "next/link";
import { Temporal } from "@js-temporal/polyfill";
import { ArrowLeft, Mail, ReceiptText, UserRound } from "lucide-react";

import PickedUpAtButton from "@/components/orders/picked-up-at-button";
import PreparedButton from "@/components/orders/prepared-button";
import ReadyButton from "@/components/orders/ready-button";
import DetailCard from "@/components/orders/detail-card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { createOptionalInstant } from "@tbs/core";
import { OrderState, formatInstant, getOrderStatus } from "@tbs/view-models";
import { OrderDetails, Status } from "@/components/orders/order.type";

type Payload<T> = { schema: string; table: string; commit_tablestamp: string; eventType: string; new: T; old: T; errors: unknown };

const statusStyles: Record<Status, string> = {
    Created: "border-slate-200 bg-slate-100 text-slate-700",
    Prepared: "border-amber-200 bg-amber-50 text-amber-700",
    "Ready for pickup": "border-emerald-200 bg-emerald-50 text-emerald-700",
    "Picked up": "border-violet-200 bg-violet-50 text-violet-700",
};

export default function OrderStatusShell({
    initialOrder,
    orderDetails: { status: initialStatus, userId, customerName, orderTotal, totalItems, email },
}: {
    initialOrder: OrderState;
    orderDetails: OrderDetails;
}) {
    const supabase = React.useMemo(() => createClient(), []);
    const [order, setOrder] = React.useState<OrderState>(initialOrder);
    const [status, setStatus] = React.useState<Status>(initialStatus);
    const [event, setEvent] = React.useState<Payload<{ [key: string]: never }>>();

    React.useEffect(() => {
        const channel = supabase
            .channel("schema-db-changes")
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
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
        if (!event) return;

        setOrder((prev) => ({
            ...prev,
            preparedAt: event.new.prepared_at,
            readyAt: event.new.ready_at,
            pickedUpAt: event.new.picked_up_at,
        }));
    }, [event]);

    React.useEffect(() => {
        setStatus(getOrderStatus(order));
    }, [order]);

    const currencyFormatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <section className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.4)] backdrop-blur-xl sm:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-3">
                        <Button variant="ghost" asChild className="-ml-2 w-fit rounded-2xl px-3 text-muted-foreground hover:text-foreground">
                            <Link href="/orders">
                                <ArrowLeft className="size-4" />
                                Back to orders
                            </Link>
                        </Button>
                        <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-4xl font-semibold tracking-tight text-foreground">Order #{order.orderId}</h1>
                                <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-semibold", statusStyles[status])}>{status}</span>
                            </div>
                            <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                                Paid {formatInstant(Temporal.Instant.from(order.paidAt))}. Review customer details, item breakdown, and move the order through fulfillment.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
                            <p className="text-sm text-muted-foreground">Items</p>
                            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{totalItems}</p>
                        </div>
                        <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
                            <p className="text-sm text-muted-foreground">Order total</p>
                            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{currencyFormatter.format(orderTotal)}</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <DetailCard title="Customer" description="Contact information tied to this order.">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
                                    <div className="mt-0.5 flex size-10 items-center justify-center rounded-2xl bg-white text-muted-foreground shadow-sm">
                                        <UserRound className="size-4" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Customer name</p>
                                        <p className="font-medium text-foreground">{customerName || "Profile name unavailable"}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
                                    <div className="mt-0.5 flex size-10 items-center justify-center rounded-2xl bg-white text-muted-foreground shadow-sm">
                                        <Mail className="size-4" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <p className="font-medium text-foreground">{email || "No email available"}</p>
                                    </div>
                                </div>
                            </div>
                        </DetailCard>

                        <DetailCard title="Order details" description="Primary references and identifiers for support or payment lookup.">
                            <dl className="space-y-4">
                                <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
                                    <dt className="text-sm text-muted-foreground">Order ID</dt>
                                    <dd className="mt-1 font-medium text-foreground">{order.orderId}</dd>
                                </div>
                                <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
                                    <dt className="text-sm text-muted-foreground">Customer ID</dt>
                                    <dd className="mt-1 break-all font-medium text-foreground">{userId}</dd>
                                </div>
                                <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
                                    <dt className="text-sm text-muted-foreground">Stripe checkout ID</dt>
                                    <dd className="mt-1 break-all font-medium text-foreground">{order.stripeId}</dd>
                                </div>
                            </dl>
                        </DetailCard>
                    </div>

                    <DetailCard title="Timeline" description="A quick view of when each stage was completed.">
                        <div className="space-y-3">
                            {[
                                { label: "Created", value: formatInstant(Temporal.Instant.from(order.createdAt)) },
                                { label: "Paid", value: formatInstant(Temporal.Instant.from(order.paidAt)) },
                                { label: "Prepared", value: formatInstant(createOptionalInstant(order.preparedAt)) },
                                { label: "Ready for pickup", value: formatInstant(createOptionalInstant(order.readyAt)) },
                                { label: "Picked up", value: formatInstant(createOptionalInstant(order.pickedUpAt)) },
                            ].map((entry) => (
                                <div key={entry.label} className="flex flex-col gap-2 rounded-[24px] border border-slate-200/70 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="font-medium text-foreground">{entry.label}</p>
                                    <p className="text-sm text-muted-foreground">{entry.value}</p>
                                </div>
                            ))}
                        </div>
                    </DetailCard>

                    <DetailCard title="Order items" description="Item-level details for packing, pickup, and issue resolution.">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="first:pl-5">Item</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead>Qty</TableHead>
                                    <TableHead>Unit price</TableHead>
                                    <TableHead className="last:pr-5">Line total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.orderItems.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="first:pl-5">
                                            <div className="space-y-1">
                                                <p className="font-medium text-foreground">{item.productName}</p>
                                                <p className="text-xs text-muted-foreground">Item #{item.id}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{item.sku}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>{currencyFormatter.format(item.unitPrice)}</TableCell>
                                        <TableCell className="last:pr-5">{currencyFormatter.format(item.unitPrice * item.quantity)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </DetailCard>
                </div>

                <div className="space-y-6">
                    <DetailCard title="Fulfillment actions" description="Advance the order to the next stage as work is completed.">
                        <div className="space-y-4">
                            <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/70 p-4">
                                <p className="text-sm font-semibold text-foreground">1. Mark prepared</p>
                                {!order.preparedAt ? <p className="mt-1 text-sm text-muted-foreground">Confirm once all items are packed and ready to move to the handoff stage.</p> : null}
                                <div className="mt-4">
                                    {order.preparedAt ? (
                                        <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                                            <p className="font-medium">Prepared</p>
                                            <p className="mt-1">{formatInstant(Temporal.Instant.from(order.preparedAt))}</p>
                                        </div>
                                    ) : (
                                        <PreparedButton orderId={order.orderId} className="w-full" />
                                    )}
                                </div>
                            </div>

                            <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/70 p-4">
                                <p className="text-sm font-semibold text-foreground">2. Mark ready for pickup</p>
                                {!order.preparedAt ? <p className="mt-1 text-sm text-muted-foreground">Only available after the order has been marked prepared.</p> : null}
                                <div className="mt-4">
                                    {!order.preparedAt ? (
                                        <Button variant="ghost" disabled={true} className="w-full justify-start rounded-2xl border border-dashed border-slate-300 bg-white/70 text-muted-foreground">
                                            Ready step is locked until preparation is confirmed
                                        </Button>
                                    ) : order.readyAt ? (
                                        <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                                            <p className="font-medium">Ready for pickup</p>
                                            <p className="mt-1">{formatInstant(Temporal.Instant.from(order.readyAt))}</p>
                                        </div>
                                    ) : (
                                        <ReadyButton orderId={order.orderId} className="w-full" />
                                    )}
                                </div>
                            </div>

                            <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/70 p-4">
                                <p className="text-sm font-semibold text-foreground">3. Confirm pickup</p>
                                {!order.readyAt ? <p className="mt-1 text-sm text-muted-foreground">Only available after the order is marked ready for pickup.</p> : null}
                                <div className="mt-4">
                                    {!order.readyAt ? (
                                        <Button variant="ghost" disabled={true} className="w-full justify-start rounded-2xl border border-dashed border-slate-300 bg-white/70 text-muted-foreground">
                                            Pickup confirmation is locked until the order is ready
                                        </Button>
                                    ) : order.pickedUpAt ? (
                                        <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                                            <p className="font-medium">Picked up</p>
                                            <p className="mt-1">{formatInstant(Temporal.Instant.from(order.pickedUpAt))}</p>
                                        </div>
                                    ) : (
                                        <PickedUpAtButton orderId={order.orderId} className="w-full" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </DetailCard>

                    <DetailCard title="Payment reference" description="Use this when reconciling or investigating a checkout issue.">
                        <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex size-10 items-center justify-center rounded-2xl bg-white text-muted-foreground shadow-sm">
                                    <ReceiptText className="size-4" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Stripe checkout ID</p>
                                    <p className="break-all font-medium text-foreground">{order.stripeId}</p>
                                </div>
                            </div>
                        </div>
                    </DetailCard>
                </div>
            </div>
        </div>
    );
}

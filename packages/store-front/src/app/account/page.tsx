"use client"
import {useAuth} from "@/context/AuthContext";
import {useEffect, useState} from "react";
import {SupabaseOrderRepository} from "@tbs/infra"
import {createClient} from "@/lib/supabase/client";
import {UserIdMapper} from "@tbs/adapters";
import {OrderState, OrderStateMapper} from "@tbs/view-models"
import Link from "next/link";
import {formatCurrency} from "@/utils/helper-functions";
import {Temporal} from "@js-temporal/polyfill";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import {Skeleton} from "@/components/ui/skeleton";
import {cn} from "@/lib/utils";
import {LogIn, Package, ShoppingBag} from "lucide-react";
import React from "react";

type Status = { time: Temporal.Instant, currentStatus: "Created" | "Prepared" | "Ready for pickup" | "Picked up" };

const statusStyles: Record<Status["currentStatus"], string> = {
    Created: "border-slate-200 bg-slate-100 text-slate-700",
    Prepared: "border-amber-200 bg-amber-100 text-amber-800",
    "Ready for pickup": "border-emerald-200 bg-emerald-100 text-emerald-800",
    "Picked up": "border-pink-200 bg-pink-100 text-pink-800",
};

function getOrderStatus(order: OrderState): Status {
    return order.pickedUpAt
        ? {time: Temporal.Instant.from(order.pickedUpAt), currentStatus: "Picked up"}
        : order.readyAt
            ? {time: Temporal.Instant.from(order.readyAt), currentStatus: "Ready for pickup"}
            : order.preparedAt
                ? {time: Temporal.Instant.from(order.preparedAt), currentStatus: "Prepared"}
                : {time: Temporal.Instant.from(order.createdAt), currentStatus: "Created"};
}

function formatInstant(instant: Temporal.Instant) {
    return instant.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

export default function AccountPage() {
    const {user, authLoading} = useAuth();
    const supabase = React.useMemo(() => createClient(), []);
    const [orders, setOrders] = useState<OrderState[]>([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);
    // @ts-ignore
    const userRepository = React.useMemo(() => new SupabaseOrderRepository(supabase), [supabase]);


    useEffect(() => {
        if (!user) {
            setOrders([]);
            return;
        }

        let isMounted = true;

        const getOrders = async () => {
            setIsLoadingOrders(true);
            try {
                const items = await userRepository.retrieveAllUserOrders(UserIdMapper.stateToDomain(user.id));
                const newOrders = items.map((domainOrder): OrderState => {
                    return OrderStateMapper.domainToState(domainOrder);
                })
                if (isMounted) {
                    setOrders(newOrders);
                }
            } finally {
                if (isMounted) {
                    setIsLoadingOrders(false);
                }
            }
        }

        void getOrders();

        return () => {
            isMounted = false;
        };
    }, [user, userRepository]);

    const isLoading = authLoading || isLoadingOrders;

    return (
        <div className="min-h-[calc(100vh-6rem)] bg-gradient-to-b from-pink-50 via-white to-white">
            <section className="border-b border-pink-100 bg-gradient-to-r from-pink-100 via-rose-50 to-orange-50">
                <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-2xl space-y-3">
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-500">Account</p>
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Your orders</h1>
                        <p className="text-base text-slate-700 sm:text-lg">
                            Review recent purchases, keep track of fulfillment progress, and confirm when each order is ready for pickup.
                        </p>
                    </div>

                    {!isLoading && user && orders.length > 0 ? (
                        <div className="rounded-2xl border border-white/70 bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
                            <p className="text-sm font-medium text-slate-500">Orders placed</p>
                            <p className="mt-1 text-3xl font-bold text-slate-900">{orders.length}</p>
                        </div>
                    ) : null}
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-6 py-10">
                {isLoading ? (
                    <div className="space-y-5">
                        {Array.from({length: 3}, (_, index) => (
                            <Card key={index} className="border-rose-100 shadow-sm">
                                <CardHeader className="gap-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="space-y-3">
                                            <Skeleton className="h-6 w-32 rounded-full"/>
                                            <Skeleton className="h-4 w-48 rounded-full"/>
                                        </div>
                                        <Skeleton className="h-6 w-28 rounded-full"/>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-3 sm:grid-cols-3">
                                        <Skeleton className="h-24 rounded-xl"/>
                                        <Skeleton className="h-24 rounded-xl"/>
                                        <Skeleton className="h-24 rounded-xl"/>
                                    </div>
                                    <Skeleton className="h-px w-full"/>
                                    <div className="space-y-3">
                                        <Skeleton className="h-16 rounded-xl"/>
                                        <Skeleton className="h-16 rounded-xl"/>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : !user ? (
                    <Empty className="rounded-3xl border border-rose-100 bg-white shadow-sm">
                        <EmptyHeader>
                            <EmptyMedia variant="icon" className="bg-rose-100 text-rose-600">
                                <LogIn className="size-5"/>
                            </EmptyMedia>
                            <EmptyTitle>Sign in to view your account details</EmptyTitle>
                            <EmptyDescription>
                                Use the account menu in the navigation to sign in or create an account, then return here to review your order history.
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Button asChild className="bg-rose-600 text-white hover:bg-rose-700">
                                <Link href={`/`}>
                                    <ShoppingBag className="size-4"/>
                                    Continue shopping
                                </Link>
                            </Button>
                        </EmptyContent>
                    </Empty>
                ) : orders.length === 0 ? (
                    <Empty className="rounded-3xl border border-dashed border-rose-200 bg-white shadow-sm">
                        <EmptyHeader>
                            <EmptyMedia variant="icon" className="bg-rose-100 text-rose-600">
                                <Package className="size-5"/>
                            </EmptyMedia>
                            <EmptyTitle>No orders yet</EmptyTitle>
                            <EmptyDescription>
                                When you place your first order, it will show up here with its fulfillment status and item summary.
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Button asChild className="bg-rose-600 text-white hover:bg-rose-700">
                                <Link href={`/cart`}>
                                    <ShoppingBag className="size-4"/>
                                    Start an order
                                </Link>
                            </Button>
                        </EmptyContent>
                    </Empty>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            const status = getOrderStatus(order);
                            const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
                            const orderTotal = order.orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

                            return (
                                <Card key={order.orderId} className="overflow-hidden border-rose-100 shadow-sm">
                                    <CardHeader className="gap-4 border-b border-rose-50 bg-white">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="space-y-2">
                                                <CardTitle className="text-2xl font-semibold tracking-tight text-slate-900">
                                                    Order #{order.orderId}
                                                </CardTitle>
                                                <CardDescription className="text-sm text-slate-600">
                                                    Placed {formatInstant(Temporal.Instant.from(order.createdAt))}
                                                </CardDescription>
                                            </div>

                                            <CardAction className="col-auto row-auto self-auto justify-self-start sm:justify-self-end">
                                                <Badge
                                                    variant="outline"
                                                    className={cn("border px-3 py-1 text-xs font-semibold", statusStyles[status.currentStatus])}
                                                >
                                                    {status.currentStatus}
                                                </Badge>
                                            </CardAction>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-6 bg-white py-6">
                                        <div className="grid gap-3 sm:grid-cols-3">
                                            <div className="rounded-2xl bg-slate-50 p-4">
                                                <p className="text-sm font-medium text-slate-500">Last updated</p>
                                                <p className="mt-2 text-base font-semibold text-slate-900">{formatInstant(status.time)}</p>
                                            </div>
                                            <div className="rounded-2xl bg-slate-50 p-4">
                                                <p className="text-sm font-medium text-slate-500">Items</p>
                                                <p className="mt-2 text-base font-semibold text-slate-900">
                                                    {totalItems} {totalItems === 1 ? "item" : "items"}
                                                </p>
                                            </div>
                                            <div className="rounded-2xl bg-slate-50 p-4">
                                                <p className="text-sm font-medium text-slate-500">Order total</p>
                                                <p className="mt-2 text-base font-semibold text-slate-900">{formatCurrency(orderTotal)}</p>
                                            </div>
                                        </div>

                                        <Separator className="bg-rose-100"/>

                                        <div className="space-y-3">
                                            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Items in this order</p>
                                            <div className="space-y-3">
                                                {order.orderItems.map((item, index) => (
                                                    <div
                                                        key={`${order.orderId}-${item.productName}-${index}`}
                                                        className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between"
                                                    >
                                                        <div className="space-y-1">
                                                            <p className="text-base font-medium text-slate-900">{item.productName}</p>
                                                            <p className="text-sm text-slate-500">Quantity: {item.quantity}</p>
                                                        </div>
                                                        <p className="text-base font-semibold text-slate-900">
                                                            {formatCurrency(item.unitPrice * item.quantity)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    )
}

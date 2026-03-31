import { redirect } from 'next/navigation'

import { stripe } from '@/lib/stripe'
import {formatCurrency} from "@/utils/helper-functions";
import OrdersButton from "@/components/account/OrdersButton";
import {Badge} from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {CheckCircle2, Mail, PackageCheck, Receipt} from "lucide-react";

export default async function Success({ searchParams }: { searchParams?: Promise<{ session_id?: string; [key: string]: string | string[] | undefined }>}) {
    const params = await searchParams


    if (!params?.session_id)
        throw new Error('Please provide a valid session_id (`cs_test_...`)')

    const session_id = params.session_id

    const {
        status,
        customer_details: { email: customerEmail },
        line_items
    } = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ['line_items', 'payment_intent']
    })

    const items = line_items?.data ?? [];
    const totalQuantity = items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
    const subtotal = items.reduce((sum, item) => sum + item.amount_subtotal, 0);
    const tax = items.reduce((sum, item) => sum + item.amount_tax, 0);
    const total = items.reduce((sum, item) => sum + item.amount_total, 0);

    if (status === 'open') {
        return redirect('/')
    }

    if (status === 'complete') {
        return (
            <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-pink-50 via-white to-orange-50/40">
                <section className="border-b border-rose-100 bg-gradient-to-r from-pink-100 via-rose-50 to-orange-50 px-6 py-16">
                    <div className="mx-auto max-w-5xl">
                        <div className="max-w-3xl space-y-5">
                            <Badge variant="outline" className="border-emerald-200 bg-emerald-100 px-3 py-1 text-emerald-800">
                                Order confirmed
                            </Badge>

                            <div className="flex items-start gap-4">
                                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
                                    <CheckCircle2 className="size-7"/>
                                </div>
                                <div className="space-y-3">
                                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                                        Thank you for your order
                                    </h1>
                                    <p className="text-lg text-slate-700">
                                        We appreciate your business. A confirmation email will be sent to{" "}
                                        <span className="font-semibold text-slate-900">{customerEmail}</span>.
                                    </p>
                                    <p className="text-sm text-slate-600 sm:text-base">
                                        If you have any questions, email{" "}
                                        <a
                                            href="mailto:orders@example.com"
                                            className="font-semibold text-rose-600 underline decoration-rose-300 underline-offset-4 transition hover:text-rose-700"
                                        >
                                            orders@example.com
                                        </a>
                                        .
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="px-6 py-10">
                    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
                        <div className="space-y-6">
                            <Card className="overflow-hidden border-rose-100 shadow-sm">
                                <CardHeader className="border-b border-rose-50 bg-white">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                                            <PackageCheck className="size-5"/>
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-semibold tracking-tight text-slate-900">
                                                Order items
                                            </CardTitle>
                                            <CardDescription className="text-slate-600">
                                                Review each item included in this checkout confirmation.
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4 py-6">
                                    {items.map((line_item) => (
                                        <div
                                            key={line_item.id}
                                            className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5"
                                        >
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="space-y-2">
                                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                                        Item reference
                                                    </p>
                                                    <p className="break-all text-sm text-slate-500">{line_item.id}</p>
                                                    <h2 className="text-xl font-semibold text-slate-900">
                                                        {line_item.description}
                                                    </h2>
                                                </div>

                                                <Badge variant="outline" className="border-slate-200 bg-white px-3 py-1 text-slate-700">
                                                    Quantity: {line_item.quantity}
                                                </Badge>
                                            </div>

                                            <div className="mt-5 grid gap-3 sm:grid-cols-3">
                                                <div className="rounded-xl bg-white p-4">
                                                    <p className="text-sm font-medium text-slate-500">Subtotal</p>
                                                    <p className="mt-2 text-base font-semibold text-slate-900">
                                                        {formatCurrency(line_item.amount_subtotal / 100)}
                                                    </p>
                                                </div>
                                                <div className="rounded-xl bg-white p-4">
                                                    <p className="text-sm font-medium text-slate-500">Tax</p>
                                                    <p className="mt-2 text-base font-semibold text-slate-900">
                                                        {formatCurrency(line_item.amount_tax / 100)}
                                                    </p>
                                                </div>
                                                <div className="rounded-xl bg-white p-4">
                                                    <p className="text-sm font-medium text-slate-500">Total</p>
                                                    <p className="mt-2 text-base font-semibold text-slate-900">
                                                        {formatCurrency(line_item.amount_total / 100)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card className="border-rose-100 shadow-sm">
                                <CardHeader className="border-b border-rose-50 bg-white">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                                            <Receipt className="size-5"/>
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-semibold text-slate-900">Order summary</CardTitle>
                                            <CardDescription className="text-slate-600">
                                                A quick breakdown of this completed checkout.
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4 py-6">
                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <p className="text-sm font-medium text-slate-500">Confirmation email</p>
                                        <p className="mt-2 break-all font-semibold text-slate-900">{customerEmail}</p>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                                        <div className="rounded-2xl bg-slate-50 p-4">
                                            <p className="text-sm font-medium text-slate-500">Line items</p>
                                            <p className="mt-2 text-2xl font-bold text-slate-900">{items.length}</p>
                                        </div>
                                        <div className="rounded-2xl bg-slate-50 p-4">
                                            <p className="text-sm font-medium text-slate-500">Units ordered</p>
                                            <p className="mt-2 text-2xl font-bold text-slate-900">{totalQuantity}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4">
                                        <div className="flex items-center justify-between gap-4 text-sm text-slate-600">
                                            <span>Subtotal</span>
                                            <span className="font-medium text-slate-900">{formatCurrency(subtotal / 100)}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-4 text-sm text-slate-600">
                                            <span>Tax</span>
                                            <span className="font-medium text-slate-900">{formatCurrency(tax / 100)}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-3 text-base font-semibold text-slate-900">
                                            <span>Order total</span>
                                            <span>{formatCurrency(total / 100)}</span>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-rose-100 bg-gradient-to-r from-pink-50 via-rose-50 to-orange-50 p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5 flex size-9 items-center justify-center rounded-full bg-white text-rose-600">
                                                <Mail className="size-4"/>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900">Need help with this order?</p>
                                                <p className="mt-1 text-sm text-slate-600">
                                                    Reach out at{" "}
                                                    <a
                                                        href="mailto:orders@example.com"
                                                        className="font-semibold text-rose-600 underline decoration-rose-300 underline-offset-4 transition hover:text-rose-700"
                                                    >
                                                        orders@example.com
                                                    </a>
                                                    .
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <OrdersButton />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            </div>

        )
    }
}

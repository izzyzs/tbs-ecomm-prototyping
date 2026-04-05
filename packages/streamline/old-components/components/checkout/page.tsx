"use client";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { Button } from "@/components/my-button";
import { useSearchParams } from "next/navigation";
import { formatCurrency } from "@/utils/helper-functions";
import { HandleCheckoutBodyType } from "@/lib/types";
import { MapPin, ShoppingBag, Store, Truck } from "lucide-react";

type Fulfillment = "pickup" | "delivery";
export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const canceled = searchParams.get("canceled");

    if (canceled) {
        console.log("Order canceled -- continue to shop around and checkout when you're ready.");
    }

    const { cartItems, subtotal } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [fulfillment, setFulfillment] = useState<Fulfillment>("pickup");
    const itemCount = cartItems.length;
    const unitCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotalAmount = subtotal();

    // when delivery calculated
    // const calculateDeliveryFee = (formData: FormData) => {}

    const handleCheckout = async () => {
        if (!user) {
            throw new Error("Create an account to check out.");
        }
        const bodyObject: HandleCheckoutBodyType = { cartItems, email: user.email, customer_id: user.id };
        const url = "/api/checkout_sessions";
        const res = await fetch(url, {
            method: "POST",
            body: JSON.stringify(bodyObject),
        });
        console.log(res);
        const resJson = await res.json();
        if (res.status === 303) {
            console.log("Redirected to cart");
            const newUrl = resJson.url;
            console.log(`parsed url: ${newUrl}`);
            router.push(`${newUrl}`);
        } else {
            console.error(resJson.error);
        }
    };

    return (
        <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-[2rem] border border-rose-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(255,245,247,0.92)_100%)] shadow-[0_24px_80px_-36px_rgba(190,24,93,0.4)]">
                <div className="border-b border-rose-200/70 bg-[radial-gradient(circle_at_top_left,rgba(251,207,232,0.5),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.98),rgba(255,241,242,0.94))] px-5 py-6 sm:px-8 sm:py-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="max-w-3xl">
                            <p className="text-xs font-semibold tracking-[0.28em] text-rose-500 uppercase">Checkout</p>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Review your order</h1>
                            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                                Confirm your line items, choose how you want to receive them, and continue to payment when you&apos;re ready.
                            </p>
                        </div>

                        <div className="inline-flex w-fit items-center rounded-full border border-rose-200 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                            {unitCount} {unitCount === 1 ? "item" : "items"}
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[1.15fr_0.85fr]">
                    <section className="rounded-[1.75rem] border border-rose-200/70 bg-white/85 p-4 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.55)] sm:p-5">
                        <div className="flex flex-col gap-3 border-b border-rose-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-xs font-semibold tracking-[0.24em] text-rose-500 uppercase">Order summary</p>
                                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Line items</h2>
                            </div>
                            <div className="inline-flex w-fit items-center rounded-full bg-rose-50 px-3 py-1 text-sm font-medium text-rose-700">
                                {itemCount} {itemCount === 1 ? "product" : "products"}
                            </div>
                        </div>

                        <ul className="mt-5 flex flex-col gap-4">
                            {cartItems.map((item, idx) => (
                                <li
                                    key={idx}
                                    className="rounded-[1.5rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.92))] p-4 shadow-[0_16px_36px_-30px_rgba(15,23,42,0.55)]"
                                >
                                    <Field className="items-stretch gap-4 sm:flex-row">
                                        <div className="flex h-28 w-full items-center justify-center rounded-[1.25rem] border border-rose-200/70 bg-[radial-gradient(circle_at_top_left,rgba(251,207,232,0.55),transparent_40%),linear-gradient(135deg,rgba(255,255,255,0.98),rgba(255,241,242,0.92))] text-rose-500 sm:w-28">
                                            <ShoppingBag className="size-8" />
                                        </div>

                                        <div className="flex flex-1 flex-col justify-between gap-4">
                                            <div>
                                                <p className="text-lg font-semibold tracking-tight text-slate-900">{item.name}</p>
                                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                                    <span>{item.quantity} @ </span>
                                                    <span>{formatCurrency(item.price)} each</span>
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap items-center justify-between gap-3">
                                                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">Qty {item.quantity}</span>
                                                <p className="text-lg font-semibold text-slate-900">{formatCurrency(item.price * item.quantity)}</p>
                                            </div>
                                        </div>
                                    </Field>
                                </li>
                            ))}

                            <li className="rounded-[1.5rem] border border-rose-200/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(255,241,242,0.9))] p-5 shadow-[0_18px_40px_-30px_rgba(190,24,93,0.3)]">
                                <Field className="items-center justify-between gap-4 sm:flex-row">
                                    <div>
                                        <p className="text-xs font-semibold tracking-[0.24em] text-rose-500 uppercase">Subtotal</p>
                                        <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{formatCurrency(subtotalAmount)}</p>
                                    </div>
                                    <p className="max-w-xs text-sm leading-6 text-slate-500">Taxes and final payment details will be handled at the next step.</p>
                                </Field>
                            </li>
                        </ul>
                    </section>

                    <section className="space-y-5">
                        <div className="rounded-[1.75rem] border border-rose-200/70 bg-white/85 p-5 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.55)]">
                            <div className="flex items-start gap-3">
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                                    <Store className="size-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold tracking-[0.24em] text-rose-500 uppercase">Fulfillment</p>
                                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Choose how you want it</h2>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">Pickup is available now. Delivery stays visible here, but remains disabled until it&apos;s ready.</p>
                                </div>
                            </div>

                            <RadioGroup className="mt-5" defaultValue={`pickup`} onValueChange={(value) => setFulfillment(value as Fulfillment)}>
                                <FieldLabel
                                    htmlFor="pickup"
                                    className="overflow-hidden rounded-[1.5rem] border-rose-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,247,250,0.88))] shadow-[0_14px_36px_-30px_rgba(15,23,42,0.55)] transition-colors hover:border-rose-300"
                                >
                                    <Field orientation="horizontal" className="items-start gap-4 bg-transparent">
                                        <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                                            <MapPin className="size-5" />
                                        </div>
                                        <FieldContent>
                                            <FieldTitle>Pick Up</FieldTitle>
                                            <FieldDescription>Pick up your order during our opening hours.</FieldDescription>
                                        </FieldContent>
                                        <RadioGroupItem value="pickup" id="pickup" />
                                    </Field>
                                </FieldLabel>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <FieldLabel
                                            htmlFor="delivery"
                                            className="overflow-hidden rounded-[1.5rem] border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.92))] shadow-[0_14px_36px_-30px_rgba(15,23,42,0.45)]"
                                        >
                                            <Field orientation="horizontal" className="items-start gap-4 bg-transparent">
                                                <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                                                    <Truck className="size-5" />
                                                </div>
                                                <FieldContent>
                                                    <FieldTitle>Delivery</FieldTitle>
                                                    <FieldDescription>Coming soon!</FieldDescription>
                                                </FieldContent>
                                                <RadioGroupItem value="delivery" id="delivery" disabled={true} />
                                            </Field>
                                        </FieldLabel>
                                    </TooltipTrigger>
                                    <TooltipContent side={`bottom`}>
                                        <p>Not yet available, coming soon!</p>
                                    </TooltipContent>
                                </Tooltip>
                            </RadioGroup>
                        </div>

                        {fulfillment === "delivery" ? (
                            <div className="rounded-[1.75rem] border border-rose-200/70 bg-white/85 p-5 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.55)]">
                                <p className="text-xs font-semibold tracking-[0.24em] text-rose-500 uppercase">Delivery address</p>
                                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Enter your address</h2>
                                <form action="" className="mt-5 grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor={`address`} className="text-sm font-medium text-slate-700">
                                            Address
                                        </Label>
                                        <Input id={`address`} name={`address`} className="rounded-xl border-slate-200 bg-white/90" />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor={`city`} className="text-sm font-medium text-slate-700">
                                            City
                                        </Label>
                                        <Input id={`city`} name={`city`} className="rounded-xl border-slate-200 bg-white/90" />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor={`state`} className="text-sm font-medium text-slate-700">
                                            State
                                        </Label>
                                        <Input id={`state`} name={`state`} className="rounded-xl border-slate-200 bg-white/90" />
                                    </div>
                                </form>
                            </div>
                        ) : fulfillment === "pickup" ? (
                            <div className="rounded-[1.75rem] border border-rose-200/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(255,241,242,0.92))] p-5 shadow-[0_20px_45px_-35px_rgba(190,24,93,0.35)]">
                                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                                    <div>
                                        <p className="text-xs font-semibold tracking-[0.24em] text-rose-500 uppercase">Ready to continue</p>
                                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Secure checkout</h2>
                                        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">You&apos;ll continue to payment with pickup selected for this order.</p>
                                    </div>
                                    <Button className="w-full rounded-full bg-rose-500 px-6 py-3 text-white hover:bg-rose-600 sm:w-auto" onClick={handleCheckout}>
                                        Checkout
                                    </Button>
                                </div>
                            </div>
                        ) : null}
                    </section>
                </div>
            </div>
        </main>
    );
}

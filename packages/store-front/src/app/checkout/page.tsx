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
import { formatCurrency } from "@/utils/helper-functions";
import { HandleCheckoutBodyType } from "@/lib/types";
import { ArrowLeft, MapPin, Store, Truck } from "lucide-react";

type Fulfillment = "pickup" | "delivery";
export default function CheckoutPage() {
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
            <div className="tbs-shell">
                <div className="tbs-hero px-5 py-6 sm:px-8 sm:py-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="max-w-3xl">
                            <p className="tbs-kicker">Checkout</p>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--tbs-plum)] sm:text-4xl">Review your order</h1>
                            <p className="mt-3 text-sm leading-6 text-[rgba(63,22,60,0.72)] sm:text-base">
                                Confirm your line items, choose how you want to receive them, and continue to payment when you&apos;re ready.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:items-end">
                            <Button
                                type="button"
                                variant="secondary"
                                className="h-11 w-full rounded-2xl px-5 sm:w-auto"
                                onClick={() => router.push("/cart")}
                            >
                                <ArrowLeft className="size-4" />
                                Back to cart
                            </Button>

                            <div className="tbs-chip">
                                {unitCount} {unitCount === 1 ? "item" : "items"}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[1.15fr_0.85fr]">
                    <section className="tbs-panel p-4 sm:p-5">
                        <div className="flex flex-col gap-3 border-b border-[var(--tbs-border-strong)] pb-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="tbs-kicker">Order summary</p>
                                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--tbs-plum)]">Line items</h2>
                            </div>
                            <div className="tbs-chip-soft text-sm font-medium">
                                {itemCount} {itemCount === 1 ? "product" : "products"}
                            </div>
                        </div>

                        <ul className="mt-5 flex flex-col gap-4">
                            {cartItems.map((item, idx) => (
                                <li
                                    key={idx}
                                    className="rounded-[1.5rem] border border-[var(--tbs-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,240,247,0.92)_74%,rgba(255,248,235,0.9))] p-4 shadow-[0_18px_40px_-30px_rgba(91,11,87,0.3)]"
                                >
                                    <Field className="items-stretch gap-4 sm:flex-row">
                                        <div className="relative flex h-28 w-full items-center justify-center overflow-hidden rounded-[1.25rem] border border-[var(--tbs-border-strong)] bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(255,241,247,0.92)_58%,rgba(255,248,235,0.9))] text-[var(--tbs-plum)] sm:max-w-[50%]">
                                            <div className="absolute -left-6 top-3 h-16 w-16 rounded-full bg-[rgba(244,182,29,0.22)] blur-2xl" />
                                            <div className="absolute bottom-0 right-0 h-20 w-20 rounded-full bg-[rgba(246,31,141,0.16)] blur-2xl" />
                                            <div className="relative flex h-16 w-16 items-center justify-center rounded-[1.2rem] border border-white/80 bg-white/90 text-sm font-semibold tracking-[0.16em] shadow-[0_14px_28px_-20px_rgba(91,11,87,0.3)]">
                                                {buildInitials(item.name)}
                                            </div>
                                        </div>

                                        <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
                                            <div>
                                                <p className="text-lg font-semibold tracking-tight text-[var(--tbs-plum)]">{item.name}</p>
                                                <p className="mt-2 text-sm leading-6 text-[rgba(63,22,60,0.68)]">
                                                    <span>{item.quantity} @ </span>
                                                    <span>{formatCurrency(item.price)} each</span>
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap items-center justify-between gap-3">
                                                <span className="tbs-chip-soft text-xs font-medium">Qty {item.quantity}</span>
                                                <p className="text-lg font-semibold text-[var(--tbs-plum)]">{formatCurrency(item.price * item.quantity)}</p>
                                            </div>
                                        </div>
                                    </Field>
                                </li>
                            ))}

                            <li className="tbs-highlight-panel p-5">
                                <Field className="items-center justify-between gap-4 sm:flex-row">
                                    <div>
                                        <p className="tbs-kicker">Subtotal</p>
                                        <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--tbs-plum)]">{formatCurrency(subtotalAmount)}</p>
                                    </div>
                                    <p className="max-w-xs text-sm leading-6 text-[rgba(63,22,60,0.68)]">Taxes and final payment details will be handled at the next step.</p>
                                </Field>
                            </li>
                        </ul>
                    </section>

                    <section className="space-y-5">
                        <div className="tbs-panel p-5">
                            <div className="flex items-start gap-3">
                                <div className="tbs-icon-badge size-11 shrink-0">
                                    <Store className="size-5" />
                                </div>
                                <div>
                                    <p className="tbs-kicker">Fulfillment</p>
                                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--tbs-plum)]">Choose how you want it</h2>
                                    <p className="mt-2 text-sm leading-6 text-[rgba(63,22,60,0.72)]">Pickup is available now. Delivery stays visible here, but remains disabled until it&apos;s ready.</p>
                                </div>
                            </div>

                            <RadioGroup className="mt-5" defaultValue={`pickup`} onValueChange={(value) => setFulfillment(value as Fulfillment)}>
                                <FieldLabel
                                    htmlFor="pickup"
                                    className="overflow-hidden rounded-[1.5rem] border-[var(--tbs-border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,240,247,0.9)_72%,rgba(255,248,235,0.9))] shadow-[0_16px_36px_-30px_rgba(91,11,87,0.28)] transition-colors hover:border-[rgba(246,31,141,0.28)]"
                                >
                                    <Field orientation="horizontal" className="items-start gap-4 bg-transparent">
                                        <div className="tbs-icon-badge mt-0.5 size-10 shrink-0 rounded-xl">
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
                                            className="overflow-hidden rounded-[1.5rem] border-[var(--tbs-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,249,242,0.92))] shadow-[0_14px_36px_-30px_rgba(91,11,87,0.18)]"
                                        >
                                            <Field orientation="horizontal" className="items-start gap-4 bg-transparent">
                                                <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(91,11,87,0.06)] text-[rgba(63,22,60,0.58)]">
                                                    <Truck className="size-5" />
                                                </div>
                                                <FieldContent>
                                                    <FieldTitle>Delivery</FieldTitle>
                                                    <FieldDescription>Coming Soon!</FieldDescription>
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
                            <div className="tbs-panel p-5">
                                <p className="tbs-kicker">Delivery address</p>
                                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--tbs-plum)]">Enter your address</h2>
                                <form action="" className="mt-5 grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor={`address`} className="text-sm font-medium text-[rgba(63,22,60,0.78)]">
                                            Address
                                        </Label>
                                        <Input id={`address`} name={`address`} className="rounded-xl border-[var(--tbs-border)] bg-white/90" />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor={`city`} className="text-sm font-medium text-[rgba(63,22,60,0.78)]">
                                            City
                                        </Label>
                                        <Input id={`city`} name={`city`} className="rounded-xl border-[var(--tbs-border)] bg-white/90" />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor={`state`} className="text-sm font-medium text-[rgba(63,22,60,0.78)]">
                                            State
                                        </Label>
                                        <Input id={`state`} name={`state`} className="rounded-xl border-[var(--tbs-border)] bg-white/90" />
                                    </div>
                                </form>
                            </div>
                        ) : fulfillment === "pickup" ? (
                            <div className="tbs-highlight-panel p-5">
                                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                                    <div>
                                        <p className="tbs-kicker">Ready to continue</p>
                                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--tbs-plum)]">Secure checkout</h2>
                                        <p className="mt-2 max-w-sm text-sm leading-6 text-[rgba(63,22,60,0.72)]">You&apos;ll continue to payment with pickup selected for this order.</p>
                                    </div>
                                    <Button className="w-full px-6 py-3 sm:w-auto" onClick={handleCheckout}>
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

function buildInitials(value: string) {
    return value
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase() ?? "")
        .join("") || "TBS";
}

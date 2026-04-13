"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { ArrowLeft, BadgeDollarSign, Boxes, CircleDot, Store, Tag } from "lucide-react";
import { toast } from "sonner";

import { updateSKUAction } from "@/app/(inventory)/updateSKUAction";
import EditInventoryAlertDialog from "@/components/edit-inventory-alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { InventorySKU } from "@tbs/infra";
import FileDropField from "@/components/file-drop-field";

type EditInventoryPageProps = { sku: InventorySKU | undefined };

type SectionCardProps = {
    title: string;
    description?: string;
    className?: string;
    children: React.ReactNode;
};

function SectionCard({ title, description, className, children }: SectionCardProps) {
    return (
        <section className={cn("rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur-xl", className)}>
            <div className="space-y-1">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
                {description ? <p className="text-sm leading-6 text-muted-foreground">{description}</p> : null}
            </div>
            <div className="mt-5">{children}</div>
        </section>
    );
}

function FieldShell({ id, label, helper, children }: { id: string; label: string; helper?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-sm font-medium text-foreground">
                {label}
            </Label>
            {children}
            {helper ? <p className="text-xs leading-5 text-muted-foreground">{helper}</p> : null}
        </div>
    );
}

function ToggleField({ id, name, label, description, defaultChecked }: { id: string; name: string; label: string; description: string; defaultChecked: boolean }) {
    return (
        <label htmlFor={id} className="block cursor-pointer rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4 transition hover:border-primary/20 hover:bg-white">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                    <p className="text-sm leading-6 text-muted-foreground">{description}</p>
                </div>
                <div className="shrink-0">
                    <input id={id} name={name} type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
                    <div className="relative h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-primary peer-focus-visible:ring-4 peer-focus-visible:ring-primary/20">
                        <span className="absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
                    </div>
                </div>
            </div>
        </label>
    );
}

function formatCurrencyFromPennies(priceInPennies: number | null | undefined) {
    if (priceInPennies === null || priceInPennies === undefined) return "Not set";

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(priceInPennies / 100);
}

export default function EditInventoryPage({ sku }: EditInventoryPageProps) {
    const [formState, formAction] = useActionState(updateSKUAction, null);

    useEffect(() => {
        if (!formState) return;

        if (formState.isError) toast.error(formState.msg);
        else if (formState.isSuccess) toast.success(formState.msg);
        else toast.info(formState.msg);
    }, [formState]);

    if (!sku) {
        return (
            <section className="mx-auto max-w-3xl rounded-[32px] border border-white/70 bg-white/80 p-10 text-center shadow-[0_24px_60px_-38px_rgba(15,23,42,0.45)] backdrop-blur-xl">
                <div className="mx-auto flex size-14 items-center justify-center rounded-[20px] bg-primary/10 text-primary">
                    <Boxes className="size-6" />
                </div>
                <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground">Select a product to edit</h1>
                <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">Open any product from the inventory table to manage its naming, pricing, stock, and ecommerce settings.</p>
                <Button asChild variant="outline" size="lg" className="mt-8 rounded-2xl">
                    <Link href="/inventory">Back to inventory</Link>
                </Button>
            </section>
        );
    }

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <section className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.4)] backdrop-blur-xl sm:p-8">
                <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                    <div className="space-y-4">
                        <Button variant="ghost" asChild className="-ml-2 w-fit rounded-2xl px-3 text-muted-foreground hover:text-foreground">
                            <Link href="/inventory">
                                <ArrowLeft className="size-4" />
                                Back to inventory
                            </Link>
                        </Button>
                        <div className="space-y-2">
                            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">Inventory editor</p>
                            <h1 className="text-4xl font-semibold tracking-tight text-foreground">Product #{sku.id}</h1>
                            <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                                {sku.item || "Untitled product"}
                                {sku.brand ? ` by ${sku.brand}` : ""}. Adjust display details, stock, pricing, and ecommerce settings from one place.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
                            <p className="text-sm text-muted-foreground">Ecommerce</p>
                            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{sku.publish_to_ecom ? "Live" : "Draft"}</p>
                        </div>
                        <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
                            <p className="text-sm text-muted-foreground">Stock on hand</p>
                            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{sku.qty ?? "N/A"}</p>
                        </div>
                        <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
                            <p className="text-sm text-muted-foreground">Current price</p>
                            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{formatCurrencyFromPennies(sku.price_in_pennies)}</p>
                        </div>
                    </div>
                </div>
            </section>

            <form id="edit-sku-form" action={formAction} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-6">
                    <SectionCard title="Identifiers" description="Reference fields stay visible here for support lookups and inventory reconciliation.">
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            <FieldShell id="id" label="Product ID" helper="Internal numeric identifier.">
                                <Input id="id" name="id" defaultValue={sku.id} readOnly={true} className="bg-slate-50 text-muted-foreground" />
                            </FieldShell>
                            <FieldShell id="system_id" label="System ID" helper="Pulled from the source inventory system.">
                                <Input id="system_id" name="system_id" defaultValue={sku.system_id ?? ""} readOnly={true} className="bg-slate-50 text-muted-foreground" />
                            </FieldShell>
                            <FieldShell id="upc" label="Barcode" helper="Locked for consistency across systems.">
                                <Input id="upc" name="upc" defaultValue={sku.barcode ?? ""} readOnly={true} className="bg-slate-50 font-mono text-muted-foreground" />
                            </FieldShell>
                        </div>
                    </SectionCard>

                    <SectionCard title="Product information" description="Keep the catalog presentation clean and consistent for operations and storefront use.">
                        <div className="grid gap-4 lg:grid-cols-2">
                            <FieldShell id="item" label="Product name" helper="Customer-facing title for the item.">
                                <Input id="item" name="item" defaultValue={sku.item ?? ""} placeholder="Enter product name" />
                            </FieldShell>
                            <FieldShell id="brand" label="Brand" helper="Optional supplier or brand label.">
                                <Input id="brand" name="brand" defaultValue={sku.brand ?? ""} placeholder="Enter brand" />
                            </FieldShell>
                        </div>
                    </SectionCard>

                    <SectionCard title="Pricing and inventory" description="Update sell price, cost basis, and quantity values used by the operations team.">
                        <div className="grid gap-4 lg:grid-cols-3">
                            <FieldShell id="qty" label="Quantity" helper="Units currently available for sale or pickup.">
                                <Input id="qty" name="qty" type="number" defaultValue={sku.qty ?? ""} placeholder="0" />
                            </FieldShell>
                            <FieldShell id="price_in_pennies" label="Price in cents" helper="Stored in pennies to avoid rounding issues.">
                                <Input id="price_in_pennies" name="price_in_pennies" type="number" defaultValue={sku.price_in_pennies ?? ""} placeholder="0" />
                            </FieldShell>
                            <FieldShell id="default_cost" label="Default cost" helper="Internal cost basis used by the team.">
                                <Input id="default_cost" name="default_cost" defaultValue={sku.default_cost ?? ""} placeholder="Enter default cost" />
                            </FieldShell>
                        </div>
                    </SectionCard>
                </div>

                <div className="space-y-6">
                    <SectionCard title="Store settings" description="These switches control how the product behaves in the storefront and checkout flow.">
                        <div className="space-y-4">
                            <ToggleField
                                id="publish_to_ecom"
                                name="publish_to_ecom"
                                label="Publish to ecommerce"
                                description="Show this item in the storefront catalog and make it available for customers."
                                defaultChecked={!!sku.publish_to_ecom}
                            />
                            <ToggleField id="tax" name="tax" label="Taxable item" description="Apply tax when the product is included in checkout calculations." defaultChecked={!!sku.tax} />
                        </div>
                    </SectionCard>

                    <SectionCard title="Snapshot" description="A quick read on the current state before you commit any edits.">
                        <div className="space-y-3">
                            {[
                                { label: "Category", value: sku.category || "Not assigned", icon: Tag },
                                { label: "Store status", value: sku.publish_to_ecom ? "Visible online" : "Hidden from storefront", icon: Store },
                                { label: "Tax handling", value: sku.tax ? "Tax enabled" : "Tax disabled", icon: CircleDot },
                                { label: "Current price", value: formatCurrencyFromPennies(sku.price_in_pennies), icon: BadgeDollarSign },
                            ].map((entry) => (
                                <div key={entry.label} className="flex items-start gap-3 rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
                                    <div className="flex size-10 items-center justify-center rounded-2xl bg-white text-muted-foreground shadow-sm">
                                        <entry.icon className="size-4" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">{entry.label}</p>
                                        <p className="font-medium text-foreground">{entry.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionCard>

                    <SectionCard title="Save changes" description="Review the edits and confirm before the product record is updated.">
                        <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                            Changes are written directly to the inventory record, so confirm the product details before saving.
                        </div>
                        <EditInventoryAlertDialog formId="edit-sku-form" />
                    </SectionCard>
                </div>
            </form>
        </div>
    );
}

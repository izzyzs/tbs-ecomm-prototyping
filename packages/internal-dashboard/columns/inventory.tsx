"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";

import { Database } from "@tbs/infra";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type InventoryRow = Database["public"]["Tables"]["inventory"]["Row"];

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

export const columns: ColumnDef<InventoryRow>[] = [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => <span className="font-mono text-xs font-medium text-muted-foreground">#{row.original.id}</span>,
    },
    {
        accessorKey: "item",
        header: "Product",
        cell: ({ row }) => {
            const name = row.original.item?.trim() || "Untitled product";

            return (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link href={`/inventory/${row.original.id}`} className="group/link block min-w-[240px] rounded-2xl p-1 transition">
                            <p className="truncate text-sm font-semibold text-foreground transition group-hover/link:text-primary">{name}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {row.original.brand?.trim() || "Brand not set"}
                                {row.original.category?.trim() ? ` · ${row.original.category}` : ""}
                            </p>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{name}</p>
                    </TooltipContent>
                </Tooltip>
            );
        },
    },
    {
        accessorKey: "brand",
        header: "Brand",
        cell: ({ row }) => <span className={cn(!row.original.brand && "text-muted-foreground")}>{row.original.brand || "Unassigned"}</span>,
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => <span className={cn(!row.original.category && "text-muted-foreground")}>{row.original.category || "Unassigned"}</span>,
    },
    {
        accessorKey: "barcode",
        header: "Barcode",
        cell: ({ row }) => <span className="font-mono text-xs tracking-[0.18em] text-muted-foreground">{row.original.barcode || "N/A"}</span>,
    },
    {
        accessorKey: "price_in_pennies",
        header: "Price",
        cell: ({ row }) => (
            <span className="font-medium text-foreground">{row.original.price_in_pennies ? currencyFormatter.format(row.original.price_in_pennies / 100) : "N/A"}</span>
        ),
    },
    {
        accessorKey: "publish_to_ecom",
        header: "Ecommerce",
        cell: ({ row }) => (
            <span
                className={cn(
                    "inline-flex rounded-full border px-3 py-1 text-xs font-semibold",
                    row.original.publish_to_ecom ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-100 text-slate-600",
                )}
            >
                {row.original.publish_to_ecom ? "Live" : "Draft"}
            </span>
        ),
    },
    {
        accessorKey: "qty",
        header: "Stock",
        cell: ({ row }) => {
            const quantity = row.original.qty;

            return (
                <span
                    className={cn(
                        "inline-flex min-w-14 justify-center rounded-full border px-3 py-1 text-xs font-semibold",
                        quantity === null || quantity === undefined
                            ? "border-slate-200 bg-slate-100 text-slate-600"
                            : quantity <= 3
                              ? "border-amber-200 bg-amber-50 text-amber-700"
                              : "border-sky-200 bg-sky-50 text-sky-700",
                    )}
                >
                    {quantity ?? "N/A"}
                </span>
            );
        },
    },
];

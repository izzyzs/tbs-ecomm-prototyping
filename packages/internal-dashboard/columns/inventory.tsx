"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InventoryRow } from "@/domain/inventory/InventoryRow";

export const columns: ColumnDef<InventoryRow>[] = [
    {
        accessorKey: "brand",
        header: "Brand",
    },
    {
        accessorKey: "item",
        header: "Name",
    },
    {
        accessorKey: "upc",
        header: "UPC",
    },
    {
        accessorKey: "customSku",
        header: "Custom SKU",
    },
    {
        accessorKey: "price",
        header: "Price",
    },
    {},
];

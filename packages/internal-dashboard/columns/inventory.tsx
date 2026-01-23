"use client";

import { ColumnDef } from "@tanstack/react-table";
import {Database, InventorySKU} from "@tbs/infra";
import {TableCell} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {Button} from "@/components/ui/button";
import Link from "next/link";

type InventoryRow = Database["public"]["Tables"]["inventory"]["Row"];


export const columns: ColumnDef<InventoryRow>[] = [
    // {
    //     accessorKey: "edit",
    //     header: () => null,
    //     cell: ({row}) => <Button onClick={() => row.toggleSelected(true)}/>
    // },

    {
        accessorKey: "id",
        header: "Id"
    },
    {
        accessorKey: "item",
        header: "Name",
        cell: ({row}) => {
            return row.original.item?.length
                ? <>
                    <Link href={`inventory/${row.original.id}`}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <p>
                                    {((row.original.item?.length < 20) ?
                                        row.original.item :
                                        row.original.item?.substring(0, 20) + "...")
                                    }
                                </p>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{row.original.item}</p>
                            </TooltipContent>
                        </Tooltip>
                    </Link>
                </>: null;
        }
    },
    {
        accessorKey: "brand",
        header: "Brand",
    },
    {
        accessorKey: "category",
        header: "Category"
    },
    // {
    //     accessorKey: "category_id",
    //     header: "Category Id"
    // },
    {
        accessorKey: "custom_sku",
        header: "Custom SKU",
    },
    {
        accessorKey: "upc",
        header: "UPC",
    },
    // {
    //     accessorKey: "ean",
    //     header: "Ean",
    // },
    {
        accessorKey: "price",
        header: "Price",
    },
    {
        accessorKey: "publish_to_ecom",
        header: "Publish to Ecommerce",
    },
    {
        accessorKey: "qty",
        header: "qty",
    },
    // {
    //     accessorKey: "system_id",
    //     header: "system_id",
    // },
    // {
    //     accessorKey: "tax",
    //     header: "tax",
    // },
];

/*
* export const columns: ColumnDef<InventoryRow>[] = [
    {
        accessorKey: "brand",
        header: () => <TableCell>Brand</TableCell>,
    },
    {
        accessorKey: "category",
        header: () => <TableCell>Category</TableCell>,
    },
    {
        accessorKey: "category_id",
        header: () => <TableCell>Category Id</TableCell>,
    },
    {
        accessorKey: "custom_sku",
        header: () =>  <TableCell>Custom SKU</TableCell>,
    },
    {
        accessorKey: "default_cost",
        header: () => <TableCell>Default Cost</TableCell>,
    },
    {
        accessorKey: "ean",
        header: () => <TableCell>Ean</TableCell>,
    },
    {
        accessorKey: "id",
        header: () => <TableCell>Id</TableCell>,
    },
    {
        accessorKey: "item",
        header: () => <TableCell>Name</TableCell>,
    },
    {
        accessorKey: "manufact_sku",
        header: () => <TableCell>Manufact SKU</TableCell>,
    },
    {
        accessorKey: "price",
        header: () =>  <TableCell>Price</TableCell>,
    },
    {
        accessorKey: "publish_to_ecom",
        header: () => <TableCell>Publish to E com</TableCell>,
    },
    {
        accessorKey: "qty",
        header: () => <TableCell>Quantity</TableCell>,
    },
    {
        accessorKey: "season",
        header: () => <TableCell>Season</TableCell>,
    },
    {
        accessorKey: "system_id",
        header: () => <TableCell>System Id</TableCell>,
    },
    {
        accessorKey: "tax",
        header: () => <TableCell>Tax</TableCell>,
    },
    {
        accessorKey: "tax_class",
        header: () => <TableCell>Tax Class</TableCell>,
    },
    {
        accessorKey: "upc",
        header: () => <TableCell>UPC</TableCell>,
    },
    {
        accessorKey: "vendor",
        header: () => <TableCell>vendor</TableCell>,
    },
    {
        accessorKey: "vendor_id",
        header: () => <TableCell>VendorId</TableCell>,
    },
];

* */
"use client";

import React from "react";
import { flexRender, getCoreRowModel, Row, useReactTable } from "@tanstack/react-table";

import { columns } from "@/columns/inventory";
import { cn } from "@/lib/utils";
import { Database } from "@tbs/infra";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type InventorySKU = Database["public"]["Tables"]["inventory"]["Row"];
type InventoryTableProps = { data: InventorySKU[]; setRow?: (row: Row<InventorySKU>) => void };

export default function InventoryTable({ data }: InventoryTableProps) {
    // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table manages imperative helpers internally.
    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        enableMultiRowSelection: false,
    });

    const rows = table.getRowModel().rows;

    return (
        <Table className="min-w-[980px]">
            <TableHeader>
                {table.getHeaderGroups().map((group) => (
                    <TableRow key={group.id} className="hover:bg-transparent">
                        {group.headers.map((header) => (
                            <TableHead key={header.id} className="first:pl-6 last:pr-6">
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </TableHead>
                        ))}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {rows.length ? (
                    rows.map((row) => <InventoryRow key={row.id} row={row} data-state={row.getIsSelected() && "selected"} />)
                ) : (
                    <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={columns.length} className="px-6 py-16 text-center">
                            <div className="mx-auto max-w-md space-y-2">
                                <p className="text-base font-semibold text-foreground">No products matched that search.</p>
                                <p className="text-sm text-muted-foreground">Try a broader keyword, barcode fragment, or product identifier.</p>
                            </div>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}

type InventoryRowProps = {
    row: Row<InventorySKU>;
} & React.ComponentPropsWithoutRef<typeof TableRow>;

const InventoryRow = ({ row, className, ...rowProps }: InventoryRowProps) => {
    return (
        <TableRow {...rowProps} className={cn("group", className)}>
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="first:pl-6 last:pr-6">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    );
};

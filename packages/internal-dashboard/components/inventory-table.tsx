"use client"
import React, { useEffect, useState } from "react";
import {Table, TableHeader, TableBody, TableRow, TableCell} from "@/components/ui/table";
import { columns } from "@/columns/inventory";
import {useReactTable, getCoreRowModel, Row, flexRender} from "@tanstack/react-table";
import {Database} from "@tbs/infra";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarProvider,
    SidebarTrigger,
    useSidebar
} from "@/components/ui/sidebar";
import {} from "lucide-react";

type InventorySKU = Database["public"]["Tables"]["inventory"]["Row"]
type InventoryTableProps = {data: InventorySKU[], setRow?: (row: Row<InventorySKU>) => void}

export default function InventoryTable({data, setRow}: InventoryTableProps ) {
    // const { toggleSidebar } = useSidebar();
    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        enableMultiRowSelection: false
    });

    return (<Table>
                <TableHeader>
                    {table.getHeaderGroups().map((group) => (
                        <TableRow key={group.id}>
                            {group.headers.map((header) => (
                                <TableCell key={header.id}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>

                    {table
                        .getRowModel()
                        .rows
                        .map((row) => (
                            <InventoryRow key={row.id} row={row} data-state={row.getIsSelected() && "selected"} />
                        ))}
                </TableBody>
            </Table>);
}
                        // (<InventorySideBar key={row.id} row={row} />))

type InventoryRowProps = {
    row: Row<InventorySKU>
} & React.ComponentPropsWithoutRef<typeof TableRow>;

const InventoryRow = ({row, ...rowProps}: InventoryRowProps) => {
    return <TableRow {...rowProps}>
        {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>)
        )}
    </TableRow>
}


"use client";
import { Database } from "@tbs/infra";

export type InventoryInsert = Database["public"]["Tables"]["inventory"]["Insert"];
export type InventoryRow = Database["public"]["Tables"]["inventory"]["Row"];

export async function createInventoryUnit(data: InventoryInsert) {
    void data;
    throw new Error("Not implemented");
}

export async function readInventoryUnits(): Promise<InventoryRow[]> {
    throw new Error("Not implemented");
}

export async function updateInventoryUnit(id: number, data: Partial<InventoryInsert>) {
    void id;
    void data;
    throw new Error("Not implemented");
}

export async function deleteInventoryUnit(id: number) {
    void id;
    throw new Error("Not implemented");
}

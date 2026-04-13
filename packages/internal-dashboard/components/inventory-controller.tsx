"use client"

import InventoryTable from "@/components/inventory-table";
import { Database } from "@tbs/infra";

type InventorySKU = Database["public"]["Tables"]["inventory"]["Row"];
type InventorySKUArray = Array<InventorySKU>;

export default function InventoryController({ data }: { data: InventorySKUArray }) {
    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <InventoryTable data={data} />
                </div>
            </div>
        </div>
    );
}

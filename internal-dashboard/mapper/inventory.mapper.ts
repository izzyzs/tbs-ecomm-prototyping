import { Database } from "@/lib/supabase/database.types";
type InventoryEntry = Database["public"]["Tables"]["inventory"]["Row"];
/*
brand: string | null
category: string | null
category_id: number | null
custom_sku: string | null
default_cost: string | null
ean: string | null
id: number
item: string | null
manufact_sku: string | null
price: string | null
publish_to_ecom: boolean | null
qty: number | null
season: string | null
system_id: string | null
tax: boolean | null
tax_class: string | null
upc: string | null
vendor: string | null
vendor_id: string | null
*/

export function inventoryEntryToTableRow(entry: InventoryEntry): IventoryTableRow {
    const row: IventoryTableRow = {
        brand: entry.brand ?? "N/A",
        category: entry.category ?? "N/A",
        categoryId: entry.category_id,
        customSku: entry.custom_sku ?? "N/A",
        defaultCost: entry.default_cost ?? "N/A",
        ean: entry.ean ?? "N/A",
        id: entry.id,
        item: entry.item ?? "N/A",
        manufacturerSku: entry.manufact_sku ?? "N/A",
        price: +(entry.price ?? "$").replace(/\$/g, ""),
        publishToEcommerce: entry.publish_to_ecom ?? false,
        quantity: entry.qty ?? 0,
        season: entry.season ?? "N/A",
        systemId: entry.system_id ?? "N/A",
        tax: entry.tax ?? false,
        taxClass: entry.tax_class ?? "N/A",
        upc: entry.upc ?? "N/A",
        vendor: entry.vendor ?? "N/A",
        vendorId: entry.vendor_id ?? "N/A",
    };
    return row;
}

export interface IventoryTableRow {
    brand: string;
    category: string;
    categoryId: number | null;
    customSku: string;
    defaultCost: string;
    ean: string;
    id: number;
    item: string;
    manufacturerSku: string;
    price: number;
    publishToEcommerce: boolean;
    quantity: number;
    season: string;
    systemId: string;
    tax: boolean;
    taxClass: string;
    upc: string;
    vendor: string;
    vendorId: string;
}

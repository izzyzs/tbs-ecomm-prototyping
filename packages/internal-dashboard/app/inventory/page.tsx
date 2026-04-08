import InventoryTable from "@/components/inventory-table";
import FilterInventoryForm from "@/components/filter-inventory-form";
import InventorySearchBar from "@/components/inventory/inventory-search-bar";
import { createClient } from "@/lib/supabase/server";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { InventorySKU } from "@tbs/infra";

type GetProductsData = { data: InventorySKU[]; cursor: number; has_more: boolean };

const getSingleSearchParam = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

const parseBooleanSearchParam = (value: string | string[] | undefined) => {
    const normalizedValue = getSingleSearchParam(value)?.trim().toLowerCase();

    if (!normalizedValue || normalizedValue === "undefined") {
        return undefined;
    }

    return normalizedValue === "true";
};

// TODO: search is currently implemented on the frontend, it needs to be incorporated into the rpc so a new search_and_filter_products/sku rpc is needed.
const matchesInventoryQuery = (sku: InventorySKU, query: string) => {
    const searchableFields = [sku.id, sku.item, sku.brand, sku.category, sku.custom_sku, sku.upc];

    return searchableFields.some((field) => field?.toString().toLowerCase().includes(query));
};

export default async function InventoryPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const params = await searchParams;
    const query = getSingleSearchParam(params.query)?.trim() ?? "";
    const normalizedQuery = query.toLowerCase();
    console.log(`query: ${normalizedQuery}`);
    const supabase = await createClient();
    let skus: InventorySKU[] | null;
    const { data, error } = await supabase.rpc("search_products", { p_query: normalizedQuery });
    skus = data?.filter((item) => item !== undefined) ?? [];

    // const published = parseBooleanSearchParam(params.published);
    // const categorySet = parseBooleanSearchParam(params.categorySet);

    // const { data, error } = (await supabase.rpc("get_products", { p_published: published, p_category_set: categorySet })) as PostgrestSingleResponse<GetProductsData>;
    // if (error) throw error;
    // if (!data) throw new Error("Inventory Retrieval Error: items not found");
    // const filteredSkus = normalizedQuery ? skus.filter((sku) => matchesInventoryQuery(sku, normalizedQuery)) : skus;

    return (
        <>
            <div className="flex flex-1 min-w-0 flex-col p-4">
                <div className="min-w-0">
                    <InventorySearchBar query={query} resultsCount={skus.length} />
                    {/* <div className="pb-4">
                        <FilterInventoryForm />
                    </div> */}
                    <div className="overflow-x-auto rounded-md border">
                        <InventoryTable data={skus} />
                    </div>
                </div>
            </div>
        </>
    );
}

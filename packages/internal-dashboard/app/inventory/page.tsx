import InventoryTable from "@/components/inventory-table";
import FilterInventoryForm, {FilterState} from "@/components/filter-inventory-form";
import {createClient} from "@/lib/supabase/server";
import {PostgrestSingleResponse} from "@supabase/supabase-js";
import {Database, InventorySKU} from "@tbs/infra";

type GetProductsData = {data: InventorySKU[], cursor: number, has_more: boolean}

//  { published: boolean | null, categorySet: boolean | null }

const correctCheckboxState = (value: boolean | undefined) => {
    if (value === false || value === undefined) {
        return false;
    }
    return true;
}

export default async function InventoryPage({searchParams}: {
searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = (await searchParams);
    const published: boolean | undefined =
        params.published !== "undefined" || typeof params.published !== "undefined" ?
            params.published?.toString().trim().toLowerCase() == "true" :
            undefined;
    const categorySet: boolean | undefined =
        params.categorySet !== "undefined" || typeof params.categorySet !== "undefined" ?
            params.categorySet?.toString().trim().toLowerCase() == "true":
            undefined;

    const supabase = await createClient();
    const { data, error } = (await supabase.rpc("get_products", { p_published: published, p_category_set: categorySet})) as PostgrestSingleResponse<GetProductsData>;
    if (error) throw error;
    if (!data) throw new Error("Inventory Retrieval Error: items not found")
    const skus = data.data.filter(i => i !== undefined);



    return (
        <>
            <div className="flex flex-1 min-w-0 flex-col p-4">
                <div className="min-w-0">
                    <div className = "pb-4">
                        <FilterInventoryForm />
                    </div>
                    <div className="overflow-x-auto rounded-md border">
                        <InventoryTable data={skus} />
                    </div>
                </div>
            </div>
        </>
        );
}

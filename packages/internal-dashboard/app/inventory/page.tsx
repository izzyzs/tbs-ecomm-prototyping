import InventoryTable from "@/components/inventory-table";
import FilterInventoryForm, {FilterState} from "@/components/filter-inventory-form";
import {createClient} from "@/lib/supabase/server";
import {PostgrestSingleResponse} from "@supabase/supabase-js";
import {Database, InventorySKU} from "@tbs/infra";

type GetProductsData = {data: InventorySKU[], cursor: number, has_more: boolean}

//  { published: boolean | null, categorySet: boolean | null }

export default async function InventoryPage({searchParams}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {

    const params = (await searchParams);
    let published: boolean | null;
    let categorySet: boolean | null;
    if (params.published !== "null") {
        switch (params.published?.toString().trim().toLowerCase()) {
            case "true":
                published = true;
                break;
            default:
                published = false;
                break;
        }
    } else published = null;
    if (params.categorySet !== "null") {
        switch (params.categorySet?.toString().trim().toLowerCase()) {
            case "true":
                categorySet = true;
                break;
            default:
                categorySet = false;
                break;
        }
    } else categorySet = null;

    const supabase = await createClient();
    let skus: InventorySKU[]
    const filterValue: FilterState = {published, categorySet}
    switch ({publishedType: typeof filterValue.published, categorySetType: typeof filterValue.categorySet}) {
        case {publishedType: "null", categorySetType: "boolean"}:

            break;
        case {publishedType: "boolean", categorySetType: "boolean"}:

            break;
        case {publishedType: "boolean", categorySetType: "null"}:

            break;
        default:
            // todo, most gotta extned this function on the db, i.e.m overload it so i can use more options
            const { data, error } = (await supabase.rpc("get_products")) as PostgrestSingleResponse<GetProductsData>
            if (error) throw error;
            if (!data) throw Error("Inventory Retrieval Error; items not found")
            skus = data.data.filter(i => i !== undefined);
            break;
    }





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

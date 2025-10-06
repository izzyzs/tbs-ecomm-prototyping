import React from "react";
import CategoryLink from "@/components/category/CategoryLink";
import ProductSearch from "@/components/category/ProductSearch";
import { createClient } from "@/lib/supabase/server";
import { capitalize } from "@/utils/capitalize";

type CategoryObject = { category: string };
const displayCategory = (categoryObject: CategoryObject, idx: number, categories: CategoryObject[]) => {
    let first: boolean = false;
    let last: boolean = false;

    if (idx == 0) {
        first = true;
    } else if (idx == categories.length - 1) {
        last = true;
    }
    // const category = capitalize(categoryObject.category) ?? categoryObject.category;
    return <CategoryLink key={idx} first={first} last={last} categoryName={categoryObject.category} />;
};

export default async function Page() {
    const supabase = await createClient();
    const { data: categories, error } = await supabase.from("unique_categories_inventory").select();
    if (categories) console.log(categories);
    if (error) console.error(error);

    return (
        <>
            <ProductSearch />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:gap-6 mx-auto pt-4 sm:p-8 rounded-sm sm:py-11 sm:px-12  bg-gradient-to-r from-pink-100 via-rose-50 to-orange-50">
                {categories?.map(displayCategory)}
            </div>
        </>
    );
}

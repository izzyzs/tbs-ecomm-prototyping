"use client";
import React, { useEffect, useState } from "react";
import ProductSearch from "@/components/search/ProductSearch";
import { createClient } from "@/lib/supabase/client";
import { CategoryObject, CategoryRow } from "@/utils/types";
import { CategoryDisplay } from "@/components/search/CategoryDisplay";
import { Database } from "@tbs/infra";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { ShopCategoryBrowser } from "@/components/search/category-browser";
// import { capitalize } from "@/utils/capitalize";

type uniqueCategoriesView = Database["public"]["Views"]["unique_categories_from_inventory"]["Row"];

export default function Page() {
    const [oldCategories, setOldCategories] = useState<CategoryObject[]>([]);
    const [categories, setCategories] = useState<CategoryRow[]>([]);
    const [activeSearch, setActiveSearch] = useState(false);
    useEffect(() => {
        const getCategories = async () => {
            const supabase = createClient();
            const { data: oldData, error: oldError } = await supabase.from("unique_categories_from_inventory").select();
            if (oldData) {
                const dbCategories: CategoryObject[] = oldData.filter((i): i is CategoryObject => i.category !== null);
                setOldCategories(dbCategories);
            }
            if (oldError) console.error(oldError);

            const { data, error } = (await supabase.rpc("get_category_tree_ignore_published")) as PostgrestSingleResponse<CategoryRow[]>;
            if (data) {
                // const dbCategories: CategoryObject[] = data
                // .filter((i): i is CategoryObject => i.category !== null)
                setCategories(data ?? []);
            }
            if (error) console.error(error);
        };
        getCategories();
    }, []);

    return (
        <>
            <ProductSearch search={activeSearch} setSearch={setActiveSearch} />
            <ShopCategoryBrowser categories={categories} />
            {/* <CategoryDisplay categories={oldCategories} search={activeSearch} /> */}
        </>
    );
}

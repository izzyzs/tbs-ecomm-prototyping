"use client";
import React, { useEffect, useState } from "react";
import ProductSearch from "@/components/search/ProductSearch";
import { createClient } from "@/lib/supabase/client";
import { CategoryObject } from "@/utils/types";
import { CategoryDisplay } from "@/components/search/CategoryDisplay";
import {Database} from "@tbs/infra";
// import { capitalize } from "@/utils/capitalize";

type uniqueCategoriesView = Database["public"]["Views"]["unique_categories_from_inventory"]["Row"]

export default function Page() {
    const [categories, setCategories] = useState<CategoryObject[]>([]);
    const [activeSearch, setActiveSearch] = useState(false);
    useEffect(() => {
        const getCategories = async () => {
            const supabase = createClient();
            const { data, error } = await supabase.from("unique_categories_from_inventory").select();
            if (data) {
                const dbCategories: CategoryObject[] = data
                    .filter((i): i is CategoryObject => i.category !== null)
                setCategories(dbCategories);
            }
            if (error) console.error(error);
        };
        getCategories();
    }, []);

    return (
        <>
            <ProductSearch search={activeSearch} setSearch={setActiveSearch} />
            <CategoryDisplay categories={categories} search={activeSearch} />
        </>
    );
}

"use client";
import React, { useEffect, useState } from "react";
import ProductSearch from "@/components/search/ProductSearch";
import { createClient } from "@/lib/supabase/client";
import { CategoryObject } from "@/utils/types";
import { CategoryDisplay } from "@/components/search/CategoryDisplay";
// import { capitalize } from "@/utils/capitalize";

export default function Page() {
    const [categories, setCategories] = useState<CategoryObject[]>([]);
    const [activeSearch, setActiveSearch] = useState(false);
    useEffect(() => {
        const getCategories = async () => {
            const supabase = createClient();
            const { data: dbCategories, error } = await supabase.from("unique_categories").select();
            if (dbCategories) {
                // console.log(dbCategories);
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

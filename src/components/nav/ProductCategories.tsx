"use client";
import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { capitalize } from "@/utils/capitalize";
import { CATEGORY_GROUP_RULES, groupCategories } from "@/utils/category-groups";

type CategoryRow = { category: string; subcategories?: any };

export default function ProductCategories() {
    // const [groups, setGroups] = React.useState<ReturnType<typeof groupCategories> | null>(null);
    const [categories, setCategories] = React.useState([]);
    React.useEffect(() => {
        async function fetchCategories() {
            const supabase = createClient();
            const { data: categories, error } = await supabase.rpc("distinct_categories");
            // const { data, error } = (await supabase.from("categories_with_grouped_subcategories_from_inventory2").select("category, subcategories")) as {
            // data: CategoryRow[] | null;
            // error: any;
            // };
            if (error) console.error(error);
            // const names = (data ?? []).map((r) => r.category).filter(Boolean);
            // setGroups(groupCategories(names));
            setCategories(categories);
        }
        fetchCategories();
    }, []);

    if (!categories) return null;

    // Render a single "Shop" trigger with a mega-menu showing grouped categories
    return (
        <div className="relative hidden sm:block">
            <div className="group inline-block">
                {categories.map((category, idx) => (
                    <Link key={idx} href={`/shop/${category}`} className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2">
                        {category}
                    </Link>
                ))}
                {/* <div className="absolute left-1/2 -translate-x-1/2 top-full z-50 hidden group-hover:block bg-white shadow-lg border rounded-md mt-0 p-4 min-w-[640px] max-w-[90vw]">
                    <div className="grid grid-cols-2 gap-6">
                        {CATEGORY_GROUP_RULES.map((rule) => {
                            const items = groups[rule.key as keyof typeof groups];
                            if (!items || items.length === 0) return null;
                            return (
                                <div key={rule.key}>
                                    <div className="text-xs uppercase tracking-wide text-gray-400 mb-2">{rule.label}</div>
                                    <ul className="space-y-1">
                                        {items.map((name) => (
                                            <li key={name}>
                                                <Link href={`/shop/${encodeURIComponent(name)}`} className="text-sm text-gray-700 hover:text-pink-600">
                                                    {capitalize(name) as string}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div> */}
            </div>
        </div>
    );
}

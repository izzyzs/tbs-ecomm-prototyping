"use client"
import {useEffect, useState} from "react";

import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {useRouter, useSearchParams} from "next/navigation";

export type FilterState = { published: boolean | undefined, categorySet: boolean | undefined };

export default function FilterInventoryForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const publishedFromUrl = searchParams.get("published") === "true";
    const categorySetFromUrl = searchParams.get("categorySet") === "true";
    const [filterState, setFilterState] = useState<FilterState>({ published: publishedFromUrl, categorySet: categorySetFromUrl });

    const filterInventory = (filterState: FilterState) => {
        const searchParams = new URLSearchParams();
        if (filterState.published) searchParams.set("published", "true");
        if (filterState.categorySet) searchParams.set("categorySet", "true");
        router.push(`/inventory?${searchParams.toString()}`);
    }

    return (
        <div className={`grid grid-cols-6 gap-2`}>
            <div className={`flex col-start-2`}>
                <Label htmlFor={`published`}>Published</Label>
                <Input type={`checkbox`} name={`published`} checked={filterState.published}
                       onChange={(event) =>
                           setFilterState((prev) => {
                               return {...prev, published: event.target.checked}
                           })}/>
            </div>

            <div className={`flex`}>
                <Label htmlFor={`categorySet`}>Has Category Set</Label>
                <Input type={`checkbox`} name={`categorySet`} checked={filterState.categorySet}
                       onChange={(event) =>
                           setFilterState((prev) => {
                               return {...prev, categorySet: event.target.checked}
                           })}/>
            </div>

            <Button onClick={() => filterInventory(filterState)}>Filter</Button>
            <Button onClick={() => router.push("/inventory/")}>Clear Filters</Button>
        </div>)
}
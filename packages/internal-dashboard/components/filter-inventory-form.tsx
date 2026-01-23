"use client"
import {useEffect, useState} from "react";

import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

export type FilterState = { published: boolean | null, categorySet: boolean | null };

export default function FilterInventoryForm({publishedDefault, categorySetDefault}: {publishedDefault?: boolean, categorySetDefault?: boolean}) {
    const router = useRouter();
    const [filterState, setFilterState] = useState<FilterState>({ published: null, categorySet: null });

    // useEffect(() => {
    //     if (filterState.published === null && filterState.categorySet === null) {
    //
    //     } else {
    //
    //     }
    // }, [filterState, router]);

    const filterInventory = (filterState: FilterState) => {
        const filterStateStrings = Object.entries(filterState).map(([key, value]) => [key, `${value}`])
        const filterStateStringsObject = Object.fromEntries(filterStateStrings)
        const searchParams = new URLSearchParams(filterStateStringsObject);
        router.push(`/inventory?${searchParams.toString()}`);
    }

    return (
        <div className={`grid grid-cols-6 gap-2`}>
            <div className={`flex col-start-2`}>
                <Label htmlFor={`published`}>Published</Label>
                <Input type={`checkbox`} name={`published`} defaultChecked={publishedDefault}
                       onChange={(event) =>
                           setFilterState((prev) => {
                               if (prev) {
                                   const {published, ...rest} = prev;
                                   return {...rest, published: event.target.checked};
                               } else
                                   return {categorySet: null, published: event.target.checked};
                           }) }/>
            </div>

            <div className={`flex`}>
                <Label htmlFor={`categorySet`}>Has Category Set</Label>
                <Input type={`checkbox`} name={`categorySet`} defaultChecked={categorySetDefault}
                       onChange={(event) =>
                           setFilterState((prev) => {
                               if (prev) {
                                   const {categorySet, ...rest} = prev;
                                   return {...rest, categorySet: event.target.checked};
                               } else
                                   return {published: null, categorySet: event.target.checked};
                           }) }/>
            </div>

            <Button onClick={() => filterInventory(filterState)}>Filter</Button>
            <Button onClick={() => router.push("/inventory/")}>Clear Filters</Button>
        </div>)
}
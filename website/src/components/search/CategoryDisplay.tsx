import React from "react";
import { CategoryObject } from "@/utils/types";
import CategoryLink from "@/components/search/CategoryLink";

export const CategoryDisplay = ({ categories, search }: { categories: CategoryObject[]; search: boolean }) => {
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

    return !search ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:gap-6 mx-auto pt-4 sm:p-8 rounded-sm sm:py-11 sm:px-12  bg-gradient-to-r from-pink-100 via-rose-50 to-orange-50">
            {categories?.map(displayCategory)}
        </div>
    ) : (
        <></>
    );
};

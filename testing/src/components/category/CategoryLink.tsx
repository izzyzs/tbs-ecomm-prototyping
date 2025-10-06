"use client";
import React, { useState } from "react";
import type { CSSProperties, ImgHTMLAttributes } from "react";
import { createClient } from "@/lib/supabase/client";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { capitalize } from "@/utils/capitalize";

interface CategoryLinkProps {
    categoryName: string;
    first: boolean;
    last: boolean;
}

export default function CategoryLink({ categoryName }: CategoryLinkProps) {
    const supabase = createClient();

    const categoryImageLink = categoryName.toLowerCase().split("&").join("and").split(" ").join("-").split("'").join();

    const { data: categoryImage } = supabase.storage.from("dev-images").getPublicUrl(`category/${categoryImageLink}.jpg`);
    const backgroundUrl = categoryImage.publicUrl;
    console.log(backgroundUrl);
    const [isOpen, setIsOpen] = useState(false);

    const toggleCollapsible = () => {
        setIsOpen(!isOpen);
    };

    return (
        // <div className={"text-center sm:py-10 hover:sm:py-20 hover:transition-all relative hover:decoration-solid"} onClick={toggleCollapsible}>
        <Link className={"text-center sm:py-10 hover:sm:py-20 hover:transition-all relative hover:decoration-solid"} href={`/shop/${categoryName.toLowerCase()}`}>
            <div className="py-10 hover:py-20 hover:h-[50vh]" />
            <Image style={{ zIndex: 0 }} fill src={backgroundUrl} alt={`image of ${categoryName}`} className="object-cover object-center border-2xl" />
            <div className="absolute inset-0 bg-black/50 sm:bg-none sm:hover:bg-pink-900/50 hover:transition-all" />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white  text-center drop-shadow-lg font-vbold text-2xl sm:text-3xl pointer-events-none">
                {`${categoryName}`}
            </div>
            {/* </div> */}
        </Link>
    );
}

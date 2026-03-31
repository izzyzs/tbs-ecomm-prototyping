"use client";
import React from "react";
import Link from "next/link";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { createClient } from "@/lib/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";
import { CategoryRow } from "@/utils/types";

export default function ProductCategories() {
    const [categories, setCategories] = React.useState<CategoryRow[]>([]);

    React.useEffect(() => {
        async function fetchCategories() {
            const supabase = createClient();
            const { data, error } = (await supabase.rpc("get_category_tree")) as unknown as { data: CategoryRow[]; error: PostgrestError };
            if (error) console.error(error);
            console.log(data);
            setCategories(data ?? []);
        }

        void fetchCategories();
    }, []);

    return (
        <div className="relative hidden sm:block">
            <NavigationMenu viewport={false} className="relative z-20 overflow-visible">
                <NavigationMenuList className="flex flex-wrap items-center gap-x-1 gap-y-2 overflow-visible">
                    {categories.map((category) => (
                        <NavigationMenuItem key={category.id} className="relative hover:z-50 focus-within:z-50">
                            <NavigationMenuTrigger className="bg-transparent">
                                <Link href={`/shop/${category.slug}`}>{category.name.replace(/-/g, " ")}</Link>
                            </NavigationMenuTrigger>

                            {category.children.length > 0 ? (
                                <NavigationMenuContent className="z-50 !mt-0 left-0 min-w-[240px] rounded-xl border border-slate-200 bg-white/95 p-2 shadow-xl backdrop-blur">
                                    <ul className="grid gap-1">
                                        {category.children.map((child) => (
                                            <ListItem key={child.id} href={`/shop/${child.slug}`} title={child.name.replace(/-/g, " ")} />
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            ) : null}
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
}

function ListItem({ title, children, href, ...props }: React.ComponentPropsWithoutRef<"li"> & { href: string; title: string }) {
    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <Link href={href} className="block rounded-lg">
                    <div className="flex flex-col gap-1 rounded-lg px-3 py-2 text-sm">
                        <div className="leading-none font-medium text-slate-900">{title}</div>
                        {children ? <div className="text-muted-foreground line-clamp-2">{children}</div> : null}
                    </div>
                </Link>
            </NavigationMenuLink>
        </li>
    );
}

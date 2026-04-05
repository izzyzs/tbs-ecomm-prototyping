"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { CategoryRow } from "@/utils/types";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";

type BrowserProps = {
    categories: CategoryRow[];
    activePath?: string;
};

type RowProps = {
    node: CategoryRow;
    depth: number;
    openPaths: Set<string>;
    togglePath: (path: string, open: boolean) => void;
    activePath?: string;
};

export function ShopCategoryBrowser({ categories, activePath }: BrowserProps) {
    const [openPaths, setOpenPaths] = useState<Set<string>>(() => new Set(getExpandedPaths(activePath)));

    useEffect(() => {
        if (!activePath) return;

        setOpenPaths((prev) => {
            const next = new Set(prev);

            for (const path of getExpandedPaths(activePath)) {
                next.add(path);
            }

            return next;
        });
    }, [activePath]);

    function togglePath(path: string, open: boolean) {
        setOpenPaths((prev) => {
            const next = new Set(prev);

            if (open) next.add(path);
            else next.delete(path);

            return next;
        });
    }

    if (categories.length === 0) {
        return (
            <section className="mx-auto w-full max-w-5xl px-4 pb-10 sm:px-6 lg:px-8">
                <div className="rounded-[2rem] border border-rose-200/70 bg-white/80 px-6 py-10 text-center shadow-[0_20px_60px_-30px_rgba(190,24,93,0.35)] backdrop-blur">
                    <p className="text-sm font-semibold tracking-[0.24em] text-rose-500 uppercase">Shop by category</p>
                    <h2 className="mt-3 text-2xl font-semibold text-slate-900">Loading...</h2>
                    {/* <h2 className="mt-3 text-2xl font-semibold text-slate-900">No categories are available yet</h2> */}
                    {/* <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
                        Once the catalog tree is loaded, this panel will show each branch of the storefront in a clearer nested view.
                    </p> */}
                </div>
            </section>
        );
    }

    return (
        <section className="mx-auto w-full max-w-5xl px-4 pb-10 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-[2rem] border border-rose-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(255,247,250,0.97)_100%)] shadow-[0_24px_80px_-36px_rgba(190,24,93,0.45)]">
                <div className="border-b border-rose-200/70 bg-[radial-gradient(circle_at_top_left,rgba(251,207,232,0.45),transparent_45%),linear-gradient(135deg,rgba(255,255,255,0.95),rgba(255,241,242,0.92))] px-5 py-5 sm:px-7">
                    <p className="text-xs font-semibold tracking-[0.28em] text-rose-500 uppercase">Find What You&apos;re Looking For</p>
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div className="max-w-2xl">
                            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Shop by Category</h2>
                            <p className="mt-2 text-sm leading-6 text-slate-600">Find what you need faster—explore categories or jump straight into what you're looking for.</p>
                        </div>
                        {/* <div className="inline-flex w-fit items-center rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                            {categories.length} root {categories.length === 1 ? "category" : "categories"}
                        </div> */}
                    </div>
                </div>

                <ul className="space-y-3 p-4 sm:p-5">
                    {categories.map((node) => (
                        <CategoryTreeNodeRow key={node.path} node={node} depth={0} openPaths={openPaths} togglePath={togglePath} activePath={activePath} />
                    ))}
                </ul>
            </div>
        </section>
    );
}

function CategoryTreeNodeRow({ node, depth, openPaths, togglePath, activePath }: RowProps) {
    const hasChildren = node.children.length > 0;
    const isOpen = openPaths.has(node.path);
    const isActive = activePath === node.path;
    const childCount = node.children.length;

    return (
        <li className="list-none">
            <Collapsible open={isOpen} onOpenChange={(open) => togglePath(node.path, open)} className="space-y-2">
                <div className="relative" style={{ marginLeft: `${depth * 18}px` }}>
                    {depth > 0 ? <span aria-hidden className="absolute top-0 bottom-0 -left-4 w-px bg-gradient-to-b from-rose-200 via-rose-200/70 to-transparent" /> : null}

                    <div
                        className={cn(
                            "group flex min-h-16 items-center gap-3 rounded-2xl border px-3 py-3 transition-all duration-200",
                            depth === 0
                                ? "border-rose-200/80 bg-white/90 shadow-[0_12px_35px_-24px_rgba(15,23,42,0.6)] hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-[0_18px_45px_-28px_rgba(190,24,93,0.35)]"
                                : "border-rose-100/80 bg-white/70 hover:border-rose-200 hover:bg-white",
                            isActive && "border-rose-400 bg-rose-50 shadow-[0_0_0_1px_rgba(244,114,182,0.18)]",
                        )}
                    >
                        {hasChildren ? (
                            <CollapsibleTrigger asChild>
                                <button
                                    type="button"
                                    aria-label={isOpen ? `Collapse ${formatCategoryName(node.name)}` : `Expand ${formatCategoryName(node.name)}`}
                                    className={cn(
                                        "flex size-10 shrink-0 items-center justify-center rounded-xl border transition-colors duration-200",
                                        isOpen ? "border-rose-300 bg-rose-100 text-rose-700" : "border-slate-200 bg-white text-slate-500 hover:border-rose-200 hover:text-rose-600",
                                    )}
                                >
                                    <ChevronRight className={cn("size-4 transition-transform duration-200", isOpen && "rotate-90")} />
                                    <span className="sr-only">{isOpen ? "Collapse branch" : "Expand branch"}</span>
                                </button>
                            </CollapsibleTrigger>
                        ) : (
                            <span className="flex size-10 shrink-0 items-center justify-center">
                                <span className="size-2 rounded-full bg-rose-300" />
                            </span>
                        )}

                        <Link
                            href={`/shop/${node.slug}`}
                            aria-current={isActive ? "page" : undefined}
                            className="min-w-0 flex-1 rounded-xl px-1 py-1 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-rose-300"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span aria-hidden className={cn("size-2.5 rounded-full", hasChildren ? "bg-rose-400" : "bg-slate-300", isActive && "bg-rose-600")} />
                                        <span className={cn("block truncate text-sm text-slate-900 sm:text-base", depth === 0 ? "font-semibold" : "font-medium", isActive && "text-rose-700")}>
                                            {formatCategoryName(node.name)}
                                        </span>
                                    </div>
                                    {/* 
                                    <p className="mt-1 pl-[18px] text-xs leading-5 text-slate-500">
                                        {hasChildren
                                            ? `${childCount} ${childCount === 1 ? "subcategory" : "subcategories"} inside this branch`
                                            : "Leaf category"}
                                    </p> */}
                                </div>

                                <div className="shrink-0 text-right">
                                    {hasChildren ? <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{childCount}</span> : null}
                                    <p className="mt-1 text-[11px] font-semibold tracking-[0.24em] text-slate-400 uppercase transition-colors group-hover:text-rose-500">View</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {hasChildren ? (
                    <CollapsibleContent className="overflow-hidden">
                        <div className="ml-4 border-l border-dashed border-rose-200/80 pl-3">
                            <ul className="space-y-2 pt-1">
                                {node.children.map((child) => (
                                    <CategoryTreeNodeRow key={child.path} node={child} depth={depth + 1} openPaths={openPaths} togglePath={togglePath} activePath={activePath} />
                                ))}
                            </ul>
                        </div>
                    </CollapsibleContent>
                ) : null}
            </Collapsible>
        </li>
    );
}

function getExpandedPaths(path?: string) {
    if (!path) return [];

    return [...getAncestorPaths(path), path];
}

function getAncestorPaths(path: string) {
    const parts = path.split(".");
    return parts.slice(0, -1).map((_, i) => parts.slice(0, i + 1).join("."));
}

function formatCategoryName(name: string) {
    return name.replace(/-/g, " ");
}

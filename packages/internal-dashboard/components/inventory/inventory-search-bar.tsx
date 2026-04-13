import Form from "next/form";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type InventorySearchBarProps = {
    query: string;
    resultsCount: number;
};

export default function InventorySearchBar({ query, resultsCount }: InventorySearchBarProps) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Catalog search</p>
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">Find products fast</h2>
                </div>

                <Form action="/inventory" className="flex w-full flex-col gap-3 sm:max-w-xl sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input type="text" placeholder="Search by product name, ID, brand, barcode, or SKU" name="query" defaultValue={query} className="pl-11" />
                    </div>
                    <Button type="submit" aria-label="Search inventory" className="h-11 rounded-2xl px-5">
                        Search
                    </Button>
                </Form>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-medium text-foreground shadow-sm">
                    {resultsCount} {resultsCount === 1 ? "result" : "results"}
                </span>
                <span>{query ? `Showing matches for “${query}”.` : "Search all inventory by default."}</span>
            </div>
        </div>
    );
}

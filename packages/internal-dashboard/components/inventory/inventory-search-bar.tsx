import Form from "next/form";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type InventorySearchBarProps = {
    query: string;
    published?: boolean;
    categorySet?: boolean;
    resultsCount: number;
};

export default function InventorySearchBar({ query, published, categorySet, resultsCount }: InventorySearchBarProps) {
    return (
        <div className="sticky top-0 z-10 flex w-full flex-col gap-3 bg-background py-4 sm:flex-row sm:items-center sm:justify-between">
            <Form action="/inventory" className="flex w-full gap-2 sm:max-w-md">
                <Input type="text" placeholder="Search inventory..." name="query" defaultValue={query} />
                {typeof published === "boolean" ? <input type="hidden" name="published" value={published.toString()} /> : null}
                {typeof categorySet === "boolean" ? <input type="hidden" name="categorySet" value={categorySet.toString()} /> : null}
                <Button type="submit" aria-label="Search inventory">
                    <Search />
                </Button>
            </Form>
            <p className="text-sm text-muted-foreground">
                {resultsCount} {resultsCount === 1 ? "result" : "results"}
            </p>
        </div>
    );
}

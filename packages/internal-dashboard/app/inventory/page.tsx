import InventoryTable from "@/components/inventory-table";
import InventorySearchBar from "@/components/inventory/inventory-search-bar";
import { createClient } from "@/lib/supabase/server";

const getSingleSearchParam = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export default async function InventoryPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const params = await searchParams;
    const query = getSingleSearchParam(params.query)?.trim() ?? "";
    const normalizedQuery = query.toLowerCase();
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("search_products", { p_query: normalizedQuery });

    if (error) throw error;

    const skus = data?.filter((item) => item !== undefined) ?? [];
    const publishedCount = skus.filter((sku) => sku.publish_to_ecom).length;
    const lowStockCount = skus.filter((sku) => (sku.qty ?? 0) <= 3).length;
    const uncategorizedCount = skus.filter((sku) => !sku.category?.trim()).length;

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <section className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.4)] backdrop-blur-xl sm:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-3">
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">Catalog operations</p>
                        <div className="space-y-2">
                            <h1 className="text-4xl font-semibold tracking-tight text-foreground">Inventory</h1>
                            <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                                Search the catalog, identify low-stock products, and jump straight into editing product details without wading through raw data.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-primary/10 bg-primary/10 px-4 py-3 text-sm text-primary shadow-sm">
                        Click a product name to open its full editor.
                    </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
                        <p className="text-sm text-muted-foreground">Visible results</p>
                        <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{skus.length}</p>
                    </div>
                    <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
                        <p className="text-sm text-muted-foreground">Published to ecommerce</p>
                        <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{publishedCount}</p>
                    </div>
                    <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
                        <p className="text-sm text-muted-foreground">Needs attention</p>
                        <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{lowStockCount + uncategorizedCount}</p>
                    </div>
                </div>
            </section>

            <section className="rounded-[32px] border border-white/70 bg-white/80 p-4 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:p-5">
                <InventorySearchBar query={query} resultsCount={skus.length} />
                <div className="mt-5 overflow-hidden rounded-[28px] border border-slate-200/80 bg-background/80">
                    <InventoryTable data={skus} />
                </div>
            </section>
        </div>
    );
}

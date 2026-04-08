import { Star, Sparkles, Package, ScanBarcode } from "lucide-react";
import AddToCartButton from "@/components/product/AddToCartButton";
import { Database } from "@tbs/infra";

type Product = Database["public"]["Tables"]["inventory"]["Row"];
type ProductViewProps = { product: Product };

export default function ProductView({ product }: ProductViewProps) {
    const productName = formatDisplayValue(product.item);
    const categoryName = formatDisplayValue(product.category);
    const brandName = formatDisplayValue(product.brand);
    // const description = product.description?.trim()
    //     ? product.description
    //     : "A reliable salon-ready essential selected for consistent performance and easy day-to-day use.";
    // const priceLabel = formatPrice(product.price);
    const priceLabel = product.price_in_pennies;
    const stockLabel = product.qty! > 0 ? `${product.qty} in stock` : "Currently unavailable";
    const barcodeLabel = product.barcode?.trim() ? product.barcode : "Not listed";
    const initials = productName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase() ?? "")
        .join("");

    return (
        <section className="mx-auto w-full max-w-7xl px-4 pb-12 pt-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-[2rem] border border-rose-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(255,245,247,0.92)_100%)] shadow-[0_24px_80px_-36px_rgba(190,24,93,0.4)]">
                <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="relative overflow-hidden border-b border-rose-200/70 bg-[radial-gradient(circle_at_top_left,rgba(251,207,232,0.55),transparent_36%),linear-gradient(150deg,rgba(255,255,255,0.98),rgba(255,241,242,0.94))] p-6 sm:p-8 lg:border-b-0 lg:border-r">
                        <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center rounded-full border border-rose-200 bg-white/85 px-3 py-1 text-xs font-semibold tracking-[0.24em] text-rose-500 uppercase">
                                Product page
                            </span>
                            <span className="inline-flex items-center rounded-full bg-white/75 px-3 py-1 text-xs font-medium text-slate-600">{categoryName}</span>
                        </div>

                        <div className="relative mt-6 flex min-h-[360px] items-center justify-center overflow-hidden rounded-[2rem] border border-rose-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(255,241,242,0.88)_100%)] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:min-h-[430px]">
                            <div className="absolute -left-12 top-10 h-36 w-36 rounded-full bg-rose-200/55 blur-3xl" />
                            <div className="absolute bottom-8 right-0 h-48 w-48 rounded-full bg-orange-100/70 blur-3xl" />
                            <div className="absolute inset-6 rounded-[1.75rem] border border-dashed border-rose-200/80" />

                            <div className="relative flex w-full max-w-md flex-col items-center text-center">
                                <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/80 bg-white/90 text-3xl font-semibold tracking-[0.16em] text-rose-600 shadow-[0_18px_40px_-22px_rgba(190,24,93,0.45)]">
                                    {initials || "PV"}
                                </div>

                                <div className="mt-6 flex items-center gap-1 text-rose-500">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} fill="currentColor" className="size-4" />
                                    ))}
                                </div>

                                <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{productName}</h2>
                                {/*<p className="mt-3 max-w-sm text-sm leading-6 text-slate-600 sm:text-base">*/}
                                {/*    A polished storefront presentation for one of your catalog essentials.*/}
                                {/*</p>*/}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8">
                        <div className="flex h-full flex-col">
                            <div className="flex flex-wrap gap-2">
                                {product.brand && <span className="inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">{brandName}</span>}
                                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">#{product.id}</span>
                            </div>

                            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{productName}</h1>

                            <div className="mt-4 flex flex-wrap items-center gap-3">
                                {/*<div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700">*/}
                                {/*    <Sparkles className="size-4 text-rose-500" />*/}
                                {/*    Salon staple*/}
                                {/*</div>*/}
                                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600">
                                    <Package className="size-4 text-slate-400" />
                                    {stockLabel}
                                </div>
                            </div>

                            {/*<p className="mt-6 text-sm leading-7 text-slate-600 sm:text-base">{description}</p>*/}

                            <div className="mt-8 rounded-[1.5rem] border border-rose-200/70 bg-white/85 p-5 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.45)]">
                                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                                    <div>
                                        <p className="text-xs font-semibold tracking-[0.24em] text-rose-500 uppercase">Price</p>
                                        <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{formatPrice(priceLabel)}</p>
                                        {/* <p className="mt-2 text-sm text-slate-500">Available now for quick storefront purchase.</p> */}
                                    </div>

                                    <AddToCartButton productId={product.id} size="lg" className="min-w-[180px] rounded-full bg-rose-500 px-6 text-white hover:bg-rose-600" />
                                </div>
                            </div>

                            <div className="mt-8 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-[1.25rem] border border-slate-200 bg-white/80 p-4">
                                    <p className="text-xs font-semibold tracking-[0.22em] text-slate-400 uppercase">Category</p>
                                    <p className="mt-2 text-sm font-medium text-slate-800">{categoryName}</p>
                                </div>

                                <div className="rounded-[1.25rem] border border-slate-200 bg-white/80 p-4">
                                    <div className="flex items-center gap-2">
                                        <ScanBarcode className="size-4 text-slate-400" />
                                        <p className="text-xs font-semibold tracking-[0.22em] text-slate-400 uppercase">Barcode</p>
                                    </div>
                                    <p className="mt-2 break-all text-sm font-medium text-slate-800">{barcodeLabel}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function formatPrice(price: number | null) {
    if (price)
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(price / 100);
    else return "N/A";
}

function formatDisplayValue(value?: string | null) {
    if (!value?.trim()) return "Unspecified";

    return value.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
}

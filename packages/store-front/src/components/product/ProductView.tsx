import { Star, Package, ScanBarcode } from "lucide-react";
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
            <div className="tbs-shell">
                <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="tbs-hero relative overflow-hidden border-b border-[var(--tbs-border-strong)] p-6 sm:p-8 lg:border-b-0 lg:border-r">
                        <div className="flex flex-wrap gap-2">
                            <span className="tbs-chip text-xs font-semibold tracking-[0.24em] uppercase">
                                Product page
                            </span>
                            <span className="inline-flex items-center rounded-full bg-white/75 px-3 py-1 text-xs font-medium text-[rgba(63,22,60,0.72)]">{categoryName}</span>
                        </div>

                        <div className="relative mt-6 flex min-h-[360px] items-center justify-center overflow-hidden rounded-[2rem] border border-[var(--tbs-border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(255,240,247,0.9)_58%,rgba(255,248,235,0.92)_100%)] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:min-h-[430px]">
                            <div className="absolute -left-12 top-10 h-36 w-36 rounded-full bg-[rgba(246,31,141,0.18)] blur-3xl" />
                            <div className="absolute bottom-8 right-0 h-48 w-48 rounded-full bg-[rgba(244,182,29,0.22)] blur-3xl" />
                            <div className="absolute inset-6 rounded-[1.75rem] border border-dashed border-[rgba(207,12,116,0.2)]" />

                            <div className="relative flex w-full max-w-md flex-col items-center text-center">
                                <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/80 bg-white/90 text-3xl font-semibold tracking-[0.16em] text-[var(--tbs-plum)] shadow-[0_18px_40px_-22px_rgba(91,11,87,0.4)]">
                                    {initials || "PV"}
                                </div>

                                <div className="mt-6 flex items-center gap-1 text-[var(--tbs-gold)]">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} fill="currentColor" className="size-4" />
                                    ))}
                                </div>

                                <h2 className="mt-5 text-2xl font-semibold tracking-tight text-[var(--tbs-plum)] sm:text-3xl">{productName}</h2>
                                {/*<p className="mt-3 max-w-sm text-sm leading-6 text-slate-600 sm:text-base">*/}
                                {/*    A polished storefront presentation for one of your catalog essentials.*/}
                                {/*</p>*/}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8">
                        <div className="flex h-full flex-col">
                            <div className="flex flex-wrap gap-2">
                                {product.brand && <span className="inline-flex items-center rounded-full bg-[rgba(255,240,247,0.9)] px-3 py-1 text-xs font-semibold text-[var(--tbs-pink-deep)]">{brandName}</span>}
                                <span className="inline-flex items-center rounded-full bg-[rgba(91,11,87,0.06)] px-3 py-1 text-xs font-medium text-[rgba(63,22,60,0.68)]">#{product.id}</span>
                            </div>

                            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-[var(--tbs-plum)] sm:text-4xl">{productName}</h1>

                            <div className="mt-4 flex flex-wrap items-center gap-3">
                                {/*<div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700">*/}
                                {/*    <Sparkles className="size-4 text-rose-500" />*/}
                                {/*    Salon staple*/}
                                {/*</div>*/}
                                <div className="tbs-chip text-sm font-medium">
                                    <Package className="size-4 text-[var(--tbs-pink-deep)]" />
                                    {stockLabel}
                                </div>
                            </div>

                            {/*<p className="mt-6 text-sm leading-7 text-slate-600 sm:text-base">{description}</p>*/}

                            <div className="tbs-highlight-panel mt-8 p-5">
                                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                                    <div>
                                        <p className="tbs-kicker">Price</p>
                                        <p className="mt-2 text-3xl font-semibold tracking-tight text-[var(--tbs-plum)]">{formatPrice(priceLabel)}</p>
                                        {/* <p className="mt-2 text-sm text-slate-500">Available now for quick storefront purchase.</p> */}
                                    </div>

                                    <AddToCartButton productId={product.id} size="lg" className="min-w-[180px] px-6" />
                                </div>
                            </div>

                            <div className="mt-8 grid gap-3 sm:grid-cols-2">
                                <div className="tbs-panel p-4">
                                    <p className="tbs-kicker">Category</p>
                                    <p className="mt-2 text-sm font-medium text-[var(--tbs-plum)]">{categoryName}</p>
                                </div>

                                <div className="tbs-panel p-4">
                                    <div className="flex items-center gap-2">
                                        <ScanBarcode className="size-4 text-[var(--tbs-pink-deep)]" />
                                        <p className="tbs-kicker">Barcode</p>
                                    </div>
                                    <p className="mt-2 break-all text-sm font-medium text-[var(--tbs-plum)]">{barcodeLabel}</p>
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

import Link from "next/link";
import { ArrowRight, Boxes, PackageSearch, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <section className="overflow-hidden rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.4)] backdrop-blur-xl sm:p-8">
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-end">
                    <div className="space-y-5">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                            Operations hub
                        </div>
                        <div className="space-y-3">
                            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                                A cleaner workspace for catalog edits and order fulfillment.
                            </h1>
                            <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                                Use the internal dashboard to keep inventory updates, stock changes, and pickup workflows organized without digging through raw tables.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Button asChild size="lg" className="rounded-2xl">
                                <Link href="/inventory">
                                    Open inventory
                                    <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="rounded-2xl">
                                <Link href="/orders">Review orders</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                        {[
                            {
                                title: "Inventory",
                                description: "Search SKUs, review stock, and move directly into product edits.",
                                icon: PackageSearch,
                                href: "/inventory",
                            },
                            {
                                title: "Orders",
                                description: "Track live order status and step orders through pickup readiness.",
                                icon: Boxes,
                                href: "/orders",
                            },
                        ].map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                className="group rounded-[28px] border border-slate-200/70 bg-slate-50/80 p-5 transition hover:-translate-y-0.5 hover:border-primary/20 hover:bg-white hover:shadow-lg hover:shadow-slate-200/60"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-3">
                                        <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                            <item.icon className="size-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold tracking-tight text-foreground">{item.title}</h2>
                                            <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
                {[
                    {
                        title: "Fewer dead ends",
                        description: "Key actions sit directly on the main surfaces so common inventory and fulfillment tasks are faster to scan.",
                    },
                    {
                        title: "Consistent hierarchy",
                        description: "Cards, tables, forms, and actions now share the same spacing, contrast, and emphasis across the dashboard.",
                    },
                    {
                        title: "Support-friendly views",
                        description: "Customer, order, and product details are grouped into cleaner sections for easier handoff across the team.",
                    },
                ].map((item) => (
                    <div
                        key={item.title}
                        className="rounded-[28px] border border-white/70 bg-white/75 p-5 shadow-[0_16px_42px_-34px_rgba(15,23,42,0.45)] backdrop-blur"
                    >
                        <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                            <ShieldCheck className="size-5" />
                        </div>
                        <h2 className="mt-4 text-lg font-semibold tracking-tight text-foreground">{item.title}</h2>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                    </div>
                ))}
            </section>
        </div>
    );
}

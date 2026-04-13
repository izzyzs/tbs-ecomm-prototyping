import Link from "next/link";
import { PackageSearch } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <section className="mx-auto flex max-w-3xl flex-col items-center rounded-[32px] border border-white/70 bg-white/80 p-10 text-center shadow-[0_24px_60px_-38px_rgba(15,23,42,0.45)] backdrop-blur-xl">
            <div className="flex size-14 items-center justify-center rounded-[20px] bg-primary/10 text-primary">
                <PackageSearch className="size-6" />
            </div>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">404</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Product not found</h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                That inventory record could not be loaded. It may have been removed, or the link may point to an invalid product ID.
            </p>
            <Button asChild variant="outline" size="lg" className="mt-8 rounded-2xl">
                <Link href="/inventory">Return to inventory</Link>
            </Button>
        </section>
    );
}

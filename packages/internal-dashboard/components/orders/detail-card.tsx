import type {ReactNode} from "react";
import {cn} from "@/lib/utils";

export default function DetailCard({ title, description, children, className }: { title: string; description?: string; children: ReactNode; className?: string }) {
    return (
        <section className={cn("rounded-3xl border bg-background p-6 shadow-sm", className)}>
            <div className="space-y-1">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
                {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
            </div>
            <div className="mt-5">{children}</div>
        </section>
    );
}
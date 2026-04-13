import type {ReactNode} from "react";
import {cn} from "@/lib/utils";

export default function DetailCard({ title, description, children, className }: { title: string; description?: string; children: ReactNode; className?: string }) {
    return (
        <section className={cn("rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.42)] backdrop-blur-xl", className)}>
            <div className="space-y-1">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
                {description ? <p className="text-sm leading-6 text-muted-foreground">{description}</p> : null}
            </div>
            <div className="mt-5">{children}</div>
        </section>
    );
}

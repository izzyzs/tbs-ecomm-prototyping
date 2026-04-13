import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-transparent text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    {
        variants: {
            variant: {
                default:
                    "bg-[linear-gradient(135deg,var(--tbs-pink)_0%,var(--tbs-pink-deep)_72%,var(--tbs-plum)_100%)] text-primary-foreground shadow-[0_18px_38px_-24px_rgba(91,11,87,0.48)] hover:-translate-y-0.5 hover:brightness-105",
                destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
                outline:
                    "border-[var(--tbs-border)] bg-white/85 text-[var(--tbs-plum)] shadow-[0_14px_30px_-24px_rgba(91,11,87,0.28)] hover:border-[var(--tbs-border-strong)] hover:bg-[rgba(255,240,247,0.9)]",
                secondary:
                    "bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(255,240,247,0.94)_62%,rgba(255,240,191,0.86))] text-[var(--tbs-plum)] shadow-[0_14px_30px_-24px_rgba(91,11,87,0.22)] hover:-translate-y-0.5 hover:brightness-[1.02]",
                ghost: "text-[var(--tbs-plum)] hover:bg-[rgba(255,240,247,0.92)] dark:hover:bg-accent/50",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-5 py-2.5 has-[>svg]:px-4",
                sm: "h-9 gap-1.5 px-4 has-[>svg]:px-3",
                lg: "h-11 px-6 has-[>svg]:px-5",
                icon: "size-9",
                "icon-sm": "size-8",
                "icon-lg": "size-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

type ButtonProps = React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    };

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
    const Comp = asChild ? Slot : "button";

    return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };

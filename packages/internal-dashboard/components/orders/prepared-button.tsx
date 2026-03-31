"use client"
import {Button} from "@/components/ui/button";
import {SupabaseOrderRepository} from "@tbs/infra";
import {createClient} from "@/lib/supabase/client";
import {Temporal} from "@js-temporal/polyfill";
import {OrderId} from "@tbs/core";
import React from "react";
import {CheckCircle2, LoaderCircle} from "lucide-react";
import {cn} from "@/lib/utils";

type ButtonProps = React.ComponentProps<typeof Button> & {orderId: number};

function formatInstant(instant: Temporal.Instant) {
    return instant.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

export default function PreparedButton({orderId: id, className, ...props}: ButtonProps) {
    const [timeString, setTimeString] = React.useState<string>();
    const [isPending, startTransition] = React.useTransition();

    const handledPrepared = async () => {
        const supabase = createClient();
        // @ts-expect-error: annoying issue with supabase typing.
        const orderRepository = new SupabaseOrderRepository(supabase);
        const preparedAt = await orderRepository.updateOrderPreparedAt(Temporal.Now.instant(), new OrderId(id));
        setTimeString(formatInstant(preparedAt))
    }

    return !timeString
        ? (
            <Button
                onClick={() => startTransition(() => {
                    void handledPrepared();
                })}
                disabled={isPending}
                className={cn("w-full justify-center rounded-xl", className)}
                {...props}
            >
                {isPending ? (
                    <>
                        <LoaderCircle className="size-4 animate-spin"/>
                        Saving...
                    </>
                ) : "Confirm order prepared"}
            </Button>
        )
        : (
            <div className={cn("rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900", className)}>
                <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0"/>
                    <div>
                        <p className="font-medium">Prepared</p>
                        <p className="mt-1">{timeString}</p>
                    </div>
                </div>
            </div>
        )
}

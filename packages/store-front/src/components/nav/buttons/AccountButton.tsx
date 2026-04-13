"use client";

import React from "react";
import Link from "next/link";
import { CircleUserRound } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const AccountButton = () => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Link
                    href={"/account"}
                    className="relative inline-flex size-11 items-center justify-center rounded-full border border-[var(--tbs-border)] bg-white/80 text-[var(--tbs-plum)] shadow-[0_12px_24px_-20px_rgba(91,11,87,0.26)] transition-all hover:-translate-y-0.5 hover:border-[var(--tbs-border-strong)] hover:bg-[rgba(255,240,247,0.9)]"
                >
                    <CircleUserRound />
                </Link>
            </TooltipTrigger>
            <TooltipContent sideOffset={8} className="rounded-full bg-[var(--tbs-plum)] px-3 py-1 text-[var(--tbs-cream)]">
                <p>Account</p>
            </TooltipContent>
        </Tooltip>
    );
};

export default AccountButton;

"use client";

import React from "react";
import Link from "next/link";
import { CircleUserRound } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const AccountButton = () => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Link href={"/account"} className="text-gray-400 hover:text-gray-900 relative">
                    <CircleUserRound />
                </Link>
            </TooltipTrigger>
            <TooltipContent>
                <p>Account</p>
            </TooltipContent>
        </Tooltip>
    )
}

export default AccountButton;
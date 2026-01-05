"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/my-button";

type SeeMoreButtonProps = { productId: number } & React.ComponentProps<typeof Button>;

export default function SeeMoreButton({ productId, ...props }: SeeMoreButtonProps) {
    const router = useRouter();
    const handleSeeMoreClick = () => router.push(`/product/${productId}`);

    return (
        <Button {...props} onClick={handleSeeMoreClick}>
            See More
        </Button>
    );
}

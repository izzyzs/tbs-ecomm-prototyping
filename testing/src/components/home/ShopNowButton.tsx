"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ShopNowButton() {
    const router = useRouter();
    const handleClick = () => {
        router.push("/shop");
    };

    return (
        <Button size="lg" onClick={handleClick}>
            Shop Now
        </Button>
    );
}

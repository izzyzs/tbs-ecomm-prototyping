"use client"
import { Button } from "@/components/my-button";
import {redirect} from "next/navigation";

export default function OrdersButton() {
    return <Button onClick={() => redirect("/account")}>View Account Details</Button>
}
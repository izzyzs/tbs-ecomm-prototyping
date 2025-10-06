import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function ProductSearch() {
    return (
        //  justify-between px-4 py-4 bg-white shadow-md fixed bottom-0 sm:bottom-auto sm:sticky sm:top-0 sm:z-50
        <div className="flex w-full py-6 px-5 sm:max-w-md items-center gap-2 sticky top-0 bg-white sm:mx-auto">
            <Input type="text" placeholder="Search for products..." />
            {/* TODO: press enter key to search functionality*/}
            <Button type="submit" variant="outline" className="border-pink-500 text-pink-500">
                <Search />
            </Button>
        </div>
    );
}

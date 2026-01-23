import EditInventoryPage from "@/components/edit-inventory-page";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

type PageProps = { params: Promise<{ id: string }> };

export default async function Page({params}: PageProps) {
    const { id } = await params;

    if (!/^\d+$/.test(id)) notFound()

    const supabase = await createClient();
    const { data: item, error } = await supabase.from("inventory").select("*").eq("id", +id).single();
    if (error) throw error;

    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 p-4 md:gap-6 md:py-6">
                    <EditInventoryPage sku={item ?? undefined}/>
                </div>
            </div>
        </div>
    );
}
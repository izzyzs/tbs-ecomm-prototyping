"use server"
import { createClient } from "@/lib/supabase/server";
import { buildPatch, getBool, getNumber, getString } from "@/lib/helpers";
import { revalidatePath } from "next/cache";
import { ToastResponse } from "@tbs/infra";

export const updateSKUAction  = async (prevState: ToastResponse | null, formData: FormData): Promise<ToastResponse> => {
    const supabase = await createClient();
    const rawId = formData.get(`id`);
    if (typeof rawId !== "string") throw new Error("Missing id")
    const id = Number(rawId)
    if (!Number.isFinite(id)) throw new Error("Invalid id")


    const {data: initial, error: readErr } = await supabase.from("inventory").select("publish_to_ecom, qty, item, price, tax, default_cost").eq("id", id).single();
    if (readErr) throw readErr
    if (!initial) throw new Error("Row not found")


    const current = {
        publish_to_ecom: getBool(formData,`publish_to_ecom`),
        qty: getNumber(formData, `qty`),
        item: getString(formData,`item`),
        price: getString(formData,`price`),
        tax: getBool(formData, `tax`),
        default_cost: getString(formData,`default_cost`)
    }

    console.log("initial: ", JSON.stringify(initial, undefined, 2))
    console.log("current: ", JSON.stringify(current, undefined, 2))

    const patch = buildPatch(initial, current);
    console.log("patch", patch);
    if (Object.keys(patch).length === 0) return {msg: `nothing to update`, isError: false, isSuccess: false};

    const { error: updateErr } = await supabase.from("inventory").update(patch).eq("id", id).select("publish_to_ecom, qty, item, price, tax, default_cost").single();
    if (updateErr) return {msg: `couldn't update: ${JSON.stringify(updateErr, null, 2)}`, isError: true, isSuccess: false};
    revalidatePath(`/inventory/${id}`)
    return {msg: `updated item #${id}`, isError: false, isSuccess: true};
}
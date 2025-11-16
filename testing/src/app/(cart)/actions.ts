"use server";

import { createClient } from "@/lib/supabase/server";
import { Deez, SearchResponse } from "@/utils/types";

export const searchProducts = async (query: string | null): Promise<SearchResponse> => {
    const supabase = await createClient();

    if (query === "") {
        return { deez: [], msg: "Oops! You're Search Is Empty, Try Again!", isError: true };
    }

    const { data, error } = await supabase.rpc("search_products_deez", { query });

    if (error) {
        return { deez: [], msg: "Error: " + error.message, isError: true };
    }
    if (data.length == 0) {
        return { deez: [], msg: "No Results. Check Your Spelling? Or We Might Not Carry What Your Looking For, Check Back Again Soon!", isError: true };
    }

    return { deez: data, msg: "Successful Search!", isError: false };
};

/* IF DECIDING ON NEXTJS/REACT HANDLING OF SEARCH HANDLING:

export const searchProducts = async (_: SearchResponse | null, formData: FormData): Promise<SearchResponse> => {
    const supabase = await createClient();
    const query = formData.get("query")?.toString();
    if (!query) {
        return { deez: [], msg: "Oops! You're Search Is Empty, Try Again!", isError: true };
    }
    const { data, error } = await supabase.rpc("search_products_deez", { query });
    if (error) {
        return { deez: [], msg: "Error: " + error.message, isError: true };
    }
    console.log(data);
    return { deez: data, msg: "Successful Search!", isError: false };
};

*/

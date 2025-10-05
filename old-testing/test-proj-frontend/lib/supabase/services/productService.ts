import { createClient } from "../server";

const supabase = await createClient();

export const getProductById = async () => {
    const { data, error } = supabase.from("Cart");
};

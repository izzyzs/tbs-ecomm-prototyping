"use client";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database.types";


const createInventoryUnit = (data: ) => {
    type insert = Database["public"]["Tables"]["inventory"]["Insert"]

    const supabase = createClient();
    supabase.from("inventory").insert()
};

const readInventoryUnits = () => {};

const updateInventoryUnit = () => {};

const deleteInventoryUnit = () => {};

// app/test/page.tsx
import { createClient } from "@/lib/supabase/server";

const TestPage = async () => {
    // const supabase = await createClient();
    // const { data, error } = await supabase.from("Product").select("*");

    // return <pre>{JSON.stringify({ data, error }, null, 2)}</pre>;
    return <div>Test Page</div>;
};

export default TestPage;

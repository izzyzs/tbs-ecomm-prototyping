import { SubmissionResponse } from "@/utils/types";
import { toast } from "sonner";

const createToast = async (fn: Promise<SubmissionResponse>) => {
        const response = await fn
        if (response.isError) {
            toast.warning(`Error: ${response.msg}`);
        } else {
            toast.success(`Success: ${response.msg}`);
        }
}

export default createToast;
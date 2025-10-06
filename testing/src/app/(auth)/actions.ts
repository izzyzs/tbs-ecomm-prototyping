"use server";

import { createClient } from "@/lib/supabase/server";
import { Credentials, SubmissionResponse } from "@/utils/types";

export const login = async (_: SubmissionResponse | null, formData: FormData): Promise<SubmissionResponse> => {
    const supabase = await createClient();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
        return { msg: "Email and password are both required.", isError: true };
    }

    const credentials: Credentials = { email, password };
    const { data, error } = await supabase.auth.signInWithPassword(credentials);

    if (error) return { msg: "Login failed: " + error.message, isError: true };
    return { msg: `Welcome back ${data.user.email}`, isError: false };
};

export const signup = async (_: SubmissionResponse | null, formData: FormData): Promise<SubmissionResponse> => {
    const supabase = await createClient();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
        return { msg: "Email and password are both required.", isError: true };
    }

    const credentials: Credentials = { email, password };
    const { data, error } = await supabase.auth.signUp(credentials);

    if (error) return { msg: "Signup failed: " + error.message, isError: true };
    return { msg: `Success!, ${data.user?.id} with email ${data.user?.email} is signed up!`, isError: false };
};

export const getErrorMessage = async (err: unknown): Promise<string> => {
    if (typeof err === "string") return err;
    if (err instanceof Error) return err.message;
    return "An error occurred. Please try again.";
};

export const handleAuth = async (_: SubmissionResponse | null, formData: FormData): Promise<SubmissionResponse> => {
    console.log("✅ handleAuth called");
    const action = formData.get("action")?.toString();
    console.log(`action: ${action}`);

    try {
        if (action == "login") {
            return await login(null, formData);
        } else if (action == "signup") {
            return await signup(null, formData);
        } else {
            throw new Error("You need to log in or sign up!");
        }
    } catch (error) {
        return { msg: await getErrorMessage(error), isError: true };
    }
};

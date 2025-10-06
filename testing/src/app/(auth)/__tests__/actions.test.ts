import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { SubmissionResponse } from "@/utils/types";

const mockSignInWithPassword = vi.fn();
const mockSignUp = vi.fn();
const mockCreateClient = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
    createClient: mockCreateClient,
}));

const actions = await import("../actions");

const successUser = { user: { email: "demo@example.com" } };

beforeEach(() => {
    mockSignInWithPassword.mockReset();
    mockSignUp.mockReset();
    mockCreateClient.mockResolvedValue({
        auth: {
            signInWithPassword: mockSignInWithPassword,
            signUp: mockSignUp,
        },
    });
});

afterEach(() => {
    vi.clearAllMocks();
});

describe("handleAuth", () => {
    it("delegates to login and returns its response", async () => {
        const formData = new FormData();
        formData.set("action", "login");
        formData.set("email", "demo@example.com");
        formData.set("password", "secret");

        const loginResponse: SubmissionResponse = { msg: "Welcome back demo@example.com", isError: false };
        mockSignInWithPassword.mockResolvedValueOnce({ data: successUser, error: null });

        const result = await actions.handleAuth(null, formData);

        expect(mockCreateClient).toHaveBeenCalledTimes(1);
        expect(mockSignInWithPassword).toHaveBeenCalledWith({ email: "demo@example.com", password: "secret" });
        expect(result).toEqual(loginResponse);
    });

    it("delegates to signup and returns its response", async () => {
        const formData = new FormData();
        formData.set("action", "signup");
        formData.set("email", "demo@example.com");
        formData.set("password", "secret");

        const signupResponse: SubmissionResponse = {
            msg: "Success!, undefined with email demo@example.com is signed up!",
            isError: false,
        };
        mockSignUp.mockResolvedValueOnce({ data: successUser, error: null });

        const result = await actions.handleAuth(null, formData);

        expect(mockCreateClient).toHaveBeenCalledTimes(1);
        expect(mockSignUp).toHaveBeenCalledWith({ email: "demo@example.com", password: "secret" });
        expect(result).toEqual(signupResponse);
    });

    it("returns a friendly error when action is missing", async () => {
        const formData = new FormData();

        const result = await actions.handleAuth(null, formData);

        expect(result.isError).toBe(true);
        expect(result.msg).toMatch(/log in or sign up/i);
    });
});

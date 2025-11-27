import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { Session } from "@supabase/supabase-js";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import UserStatusController from "../UserStatusController";

const mockGetSession = vi.fn();
const mockSignOut = vi.fn();
const mockOnAuthStateChange = vi.fn();

const mockSupabase = {
    auth: {
        getSession: mockGetSession,
        onAuthStateChange: mockOnAuthStateChange,
        signOut: mockSignOut,
    },
};

vi.mock("@/lib/supabase/client", () => ({
    createClient: () => mockSupabase,
}));

const sessionStub = {
    user: { email: "user@example.com" },
} as unknown as Session;

afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});

beforeEach(() => {
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null });
    mockSignOut.mockResolvedValue({ error: null });
    mockOnAuthStateChange.mockImplementation((_callback: (event: string, session: Session | null) => void) => {
        return {
            data: {
                subscription: {
                    unsubscribe: vi.fn(),
                },
            },
        };
    });
});

describe("UserStatusController", () => {
    it("renders session info when Supabase returns a session", async () => {
        mockGetSession.mockResolvedValueOnce({ data: { session: sessionStub }, error: null });

        render(<UserStatusController />);

        await waitFor(() => {
            expect(screen.getByText(`Welcome back, ${sessionStub.user.email}!`)).toBeTruthy();
        });
        expect(screen.getByRole("button", { name: "Sign out" })).toBeTruthy();
    });

    it("signs out and shows auth modals", async () => {
        mockGetSession.mockResolvedValueOnce({ data: { session: sessionStub }, error: null });

        render(<UserStatusController />);

        await waitFor(() => {
            expect(screen.getByRole("button", { name: "Sign out" })).toBeTruthy();
        });

        fireEvent.click(screen.getByRole("button", { name: "Sign out" }));

        await waitFor(() => {
            expect(mockSignOut).toHaveBeenCalledTimes(1);
        });

        await waitFor(() => {
            expect(screen.queryByText(/Welcome back/)).toBeNull();
        });

        expect(screen.getByRole("button", { name: "Log in" })).toBeTruthy();
    });

    it("surfaces auth errors inside the login modal", async () => {
        const errorMessage = "Unable to fetch session";
        mockGetSession.mockResolvedValueOnce({
            data: { session: null },
            error: { message: errorMessage },
        });

        render(<UserStatusController />);

        await waitFor(() => {
            expect(mockGetSession).toHaveBeenCalled();
        });

        fireEvent.click(screen.getByRole("button", { name: "Log in" }));

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeTruthy();
        });
    });
});

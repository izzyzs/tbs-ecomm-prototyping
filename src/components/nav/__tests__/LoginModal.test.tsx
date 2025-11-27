import { render } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { SubmissionResponse } from "@/utils/types";
import LoginModal from "../LoginModal";

const setOpen = vi.fn();
const openSignUp = vi.fn();
const submitForm = vi.fn();

const useActionStateSpy = vi.spyOn(React, "useActionState");

type UseActionStateReturn = [SubmissionResponse | null, (formData: FormData) => void, boolean];

describe("LoginModal", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        setOpen.mockReset();
        openSignUp.mockReset();
        submitForm.mockReset();
    });

    afterEach(() => {
        vi.useRealTimers();
        useActionStateSpy.mockReset();
    });

    it("closes shortly after a successful login", () => {
        const successState: SubmissionResponse = { msg: "Welcome back", isError: false };
        useActionStateSpy.mockReturnValue([successState, submitForm, false] as unknown as UseActionStateReturn);

        render(<LoginModal open={true} setOpen={setOpen} openSignUp={openSignUp} externalError={null} />);

        expect(setOpen).not.toHaveBeenCalled();

        vi.advanceTimersByTime(800);

        expect(setOpen).toHaveBeenCalledWith(false);
    });
});

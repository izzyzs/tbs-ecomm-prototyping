"use client";
import React from "react";
import { Button } from "@/components/ui/button";

type SignUpButtonProps = { setLogin: (b: boolean) => void; setSignUp: (b: boolean) => void };

export default function SignUpButton({ setLogin, setSignUp }: SignUpButtonProps) {
    function switchToSignUp() {
        setSignUp(true);
        setLogin(false);
    }

    return (
        <Button variant="secondary" className="w-full mt-1" onClick={switchToSignUp} type="button">
            Sign Up
        </Button>
    );
}

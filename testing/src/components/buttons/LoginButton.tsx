"use client";
import React from "react";
import { Button } from "@/components/ui/button";

type LoginButtonProps = { setLogin: (b: boolean) => void; setSignUp: (b: boolean) => void };

export default function LoginButton({ setLogin, setSignUp }: LoginButtonProps) {
    function switchToLogin() {
        setLogin(true);
        setSignUp(false);
    }

    return (
        <Button variant="secondary" className="w-full mt-1" onClick={switchToLogin} type="button">
            Log In
        </Button>
    );
}

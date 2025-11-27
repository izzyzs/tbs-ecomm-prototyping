"use client";
import React from "react";

import { SubmissionResponse } from "@/utils/types";
import Form from "next/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2Icon, Eye, EyeOff } from "lucide-react";
import LoginButton from "@/components/nav/buttons/LoginButton";
import { useAuth } from "@/context/AuthContext";

type SignUpModalProps = {
    open: boolean;
    setOpen: (b: boolean) => void;
    openLogin: (b: boolean) => void;
    externalError?: string | null;
};

const SignUpModal = ({ open, setOpen, openLogin, externalError }: SignUpModalProps) => {
    const { signup } = useAuth();
    const [state, submitForm, isPending] = React.useActionState<SubmissionResponse | null, FormData>(signup, null);

    const [password, setPassword] = React.useState<string>("");
    const [passwordCheck, setPasswordCheck] = React.useState<string>("");
    const [passwordsAreEqual, setPasswordsAreEqual] = React.useState<boolean>(true);
    const checkForEquivalency = () => {
        setPasswordsAreEqual(password === passwordCheck);
    };

    const [showPasswords, setShowPasswords] = React.useState<boolean>(false);
    const handleShowPasswordClick = () => {
        setShowPasswords(!showPasswords);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" size="sm">
                    Sign Up
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Sign in</DialogTitle>
                    <DialogDescription>Enter your credentials to access member pricing and benefits.</DialogDescription>
                </DialogHeader>
                <Form className="mt-4 space-y-3" action={submitForm}>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input name="email" type="email" placeholder="name@example.com" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            name="password"
                            type={showPasswords ? "text" : "password"}
                            placeholder={showPasswords ? "password" : "••••••••"}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={checkForEquivalency}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password2">Confirm your Password</Label>
                        <Input
                            name="password2"
                            type={showPasswords ? "text" : "password"}
                            onChange={(e) => setPasswordCheck(e.target.value)}
                            onBlur={checkForEquivalency}
                            placeholder={showPasswords ? "password" : "••••••••"}
                        />
                        {!passwordsAreEqual && <Label className={"text-sm  text-red-600"}>The passwords aren't equal. Try again.</Label>}
                    </div>
                    <Button onClick={handleShowPasswordClick} type="button">
                        {showPasswords ? <Eye /> : <EyeOff />}
                    </Button>
                    <DialogFooter className="flex sm:flex-col items-center justify-between gap-4">
                        <Button type="submit" className="w-full" name="action" value="signup" disabled={isPending}>
                            {isPending && <Loader2Icon className="animate-spin" />}
                            {!isPending ? "Sign Up" : "Please wait"}
                        </Button>

                        <div className="h-0 border-2 w-full border-slate-300" />
                        <Label className="text-sm text-muted-foreground">Already made an account?</Label>
                        <LoginButton setLogin={openLogin} setSignUp={setOpen} />
                        {state && <Label className={`text-sm ${state.isError ? "text-red-600" : "text-green-700"}`}>{state.msg}</Label>}
                        {!state && externalError && (
                            <Label className="text-sm text-red-600" role="alert">
                                {externalError}
                            </Label>
                        )}
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default SignUpModal;

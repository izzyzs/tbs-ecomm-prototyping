"use client";
import React from "react";

import Form from "next/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/app/(auth)/actions";
import { Loader2Icon } from "lucide-react";
import { SubmissionResponse } from "@/utils/types";
import SignUpButton from "@/components/buttons/SignUpButton";

type LoginModalProps = {
    open: boolean;
    setOpen: (b: boolean) => void;
    openSignUp: (b: boolean) => void;
    externalError?: string | null;
};

const LoginModal = ({ open, setOpen, openSignUp, externalError }: LoginModalProps) => {
    const [state, submitForm, isPending] = React.useActionState<SubmissionResponse | null, FormData>(login, null);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    Log in
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Log in to your account</DialogTitle>
                    <DialogDescription>Enter your credentials to access member pricing and benefits.</DialogDescription>
                </DialogHeader>
                <Form className="mt-4 space-y-3" action={submitForm}>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input name="email" type="email" placeholder="name@example.com" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input name="password" type="password" placeholder="••••••••" />
                    </div>
                    <DialogFooter className="flex sm:flex-col items-center justify-between gap-4">
                        <Button type="submit" className="w-full" name="action" value="login" disabled={isPending}>
                            {isPending && <Loader2Icon className="animate-spin" />}
                            {!isPending ? "Log In" : "Please wait"}
                        </Button>
                        <div className="h-0 border-2 w-full border-slate-300" />

                        <Label className="text-sm text-muted-foreground">Haven't made an account?</Label>
                        <SignUpButton setSignUp={openSignUp} setLogin={setOpen} />
                        {state && (
                            <Label className={`text-sm ${state.isError ? "text-red-600" : "text-green-700"}`}>{state.msg}</Label>
                        )}
                        {!state && externalError && <Label className="text-sm text-red-600" role="alert">{externalError}</Label>}
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default LoginModal;

// <Button variant="secondary" className="w-full mt-1" name="action" value="signup">

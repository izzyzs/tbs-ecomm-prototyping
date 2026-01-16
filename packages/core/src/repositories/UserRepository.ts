import React from "react";
import { User } from "@/entities/index.js";
import { Email } from "@/entities/index.js";
import { Password } from "@/entities/index.js";

export interface UserRepository {
    createAccount(email: Email, password: Password): Promise<User>;
    getUserFromLogin(email: Email, password: Password): Promise<User>;
    getUserFromSession(): Promise<User | null>;
    signOut(setSigningOut: React.Dispatch<React.SetStateAction<boolean>>): Promise<void>;
}

export class AuthError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AuthError";
    }
}

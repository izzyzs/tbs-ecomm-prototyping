import React from "react";
import { User } from "@/domain/user/User";
import Email from "@/domain/user/Email";
import Password from "@/domain/user/Password";
export interface UserRepository {
    createAccount(email: Email, password: Password): Promise<User>;
    getUserFromLogin(email: Email, password: Password): Promise<User>;
    getUserFromSession(): Promise<User>;
    signOut(setSigningOut: React.Dispatch<React.SetStateAction<boolean>>): Promise<void>;
}
export declare class AuthError extends Error {
    constructor(message: string);
}
//# sourceMappingURL=UserRepository.d.ts.map
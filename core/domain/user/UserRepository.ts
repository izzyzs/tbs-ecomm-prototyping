import { User } from "@/core/domain/user/user"
import Email from "@/core/domain/user/Email"
import Password from "@/core/domain/user/Password"

export interface UserRepository {
    createAccount(email: Email, password: Password): Promise<User>
    getUserFromLogin(email: Email, password: Password): Promise<User>
    getUserFromSession(): Promise<User>
    signOut(setSigningOut:  React.Dispatch<React.SetStateAction<boolean>>): Promise<void>
}


export class AuthError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AuthError";
    }
}
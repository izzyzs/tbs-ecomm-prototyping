import { User } from "@/domain/user/user"
import Email from "@/domain/user/Email"
import Password from "@/domain/user/Password"

export interface UserRepository {
    createAccount(email: Email, password: Password): Promise<User>
    getUserDetails(email: Email, password: Password): Promise<User>
    signOut(signingOut: boolean, setSigningOut:  React.Dispatch<React.SetStateAction<boolean>>): Promise<void>
}


export class AuthError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AuthError";
    }
}
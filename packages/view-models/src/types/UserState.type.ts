import { RoleValue } from "@tbs/core";

export interface UserState {
    id: string;
    email: string;
    isAuthenticated: boolean;
    role: RoleValue;
}

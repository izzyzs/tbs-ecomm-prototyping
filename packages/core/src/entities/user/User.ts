// user.ts

import { Email } from "../../entities/index.js";
import { UserId } from "../../entities/index.js";

export class User {
    public role: Role;

    constructor(
        public id: UserId,
        public email: Email,
        public isAuthenticated: boolean,
        role?: Role
    ) {
        this.role = role ?? Role.create("customer", "standard");
    }
}

export const CUSTOMER_TYPES = ["standard", "professional", "friends", "family", "employee"] as const;
export const EMPLOYEE_TYPES = ["standard", "stock-keeper", "admin", "driver"] as const;

export type CustomerType = (typeof CUSTOMER_TYPES)[number];
export type EmployeeType = (typeof EMPLOYEE_TYPES)[number];

export type RoleValue = { role: "customer"; kind: CustomerType } | { role: "employee"; kind: EmployeeType };

export function isCustomerType(value: unknown): value is CustomerType {
    return typeof value === "string" && CUSTOMER_TYPES.includes(value as CustomerType);
}
export function isEmployeeType(value: unknown): value is EmployeeType {
    return typeof value === "string" && EMPLOYEE_TYPES.includes(value as EmployeeType);
}

export class Role {
    private constructor(readonly value: RoleValue) {}

    static create(role: unknown, kind: unknown): Role {
        if (role != "customer" && role != "employee") {
            throw new RoleError("not a valid role. they can either be a customer or employee");
        }
        if (role === "customer" && isCustomerType(kind)) {
            return new Role({ role, kind });
        } else if (role === "employee" && isEmployeeType(kind)) {
            return new Role({ role, kind });
        }

        throw new Error("not a valid kind of customer.");
    }
}

export class RoleError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "RoleError";
    }
}

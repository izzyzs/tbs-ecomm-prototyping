// user.ts
export class User {
    constructor(id, email, isAuthenticated, role) {
        this.id = id;
        this.email = email;
        this.isAuthenticated = isAuthenticated;
        this.role = role ?? Role.create("customer", "standard");
    }
}
export const CUSTOMER_TYPES = ["standard", "professional", "friends", "family", "employee"];
export const EMPLOYEE_TYPES = ["standard", "stock-keeper", "admin", "driver"];
export function isCustomerType(value) {
    return typeof value === "string" && CUSTOMER_TYPES.includes(value);
}
export function isEmployeeType(value) {
    return typeof value === "string" && EMPLOYEE_TYPES.includes(value);
}
export class Role {
    constructor(value) {
        this.value = value;
    }
    static create(role, kind) {
        if (role != "customer" && role != "employee") {
            throw new RoleError("not a valid role. they can either be a customer or employee");
        }
        if (role === "customer" && isCustomerType(kind)) {
            return new Role({ role, kind });
        }
        else if (role === "employee" && isEmployeeType(kind)) {
            return new Role({ role, kind });
        }
        throw new Error("not a valid kind of customer.");
    }
}
export class RoleError extends Error {
    constructor(message) {
        super(message);
        this.name = "RoleError";
    }
}

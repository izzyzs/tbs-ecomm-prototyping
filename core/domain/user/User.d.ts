import Email from "@/domain/user/Email";
import { UserId } from "@/domain/Identity";
export declare class User {
    id: UserId;
    email: Email;
    isAuthenticated: boolean;
    role: Role;
    constructor(id: UserId, email: Email, isAuthenticated: boolean, role?: Role);
}
export declare const CUSTOMER_TYPES: readonly ["standard", "professional", "friends", "family", "employee"];
export declare const EMPLOYEE_TYPES: readonly ["standard", "stock-keeper", "admin", "driver"];
export type CustomerType = (typeof CUSTOMER_TYPES)[number];
export type EmployeeType = (typeof EMPLOYEE_TYPES)[number];
export type RoleValue =
    | {
          role: "customer";
          kind: CustomerType;
      }
    | {
          role: "employee";
          kind: EmployeeType;
      };
export declare function isCustomerType(value: unknown): value is CustomerType;
export declare function isEmployeeType(value: unknown): value is EmployeeType;
export declare class Role {
    readonly value: RoleValue;
    private constructor();
    static create(role: unknown, kind: unknown): Role;
}
export declare class RoleError extends Error {
    constructor(message: string);
}
//# sourceMappingURL=User.d.ts.map

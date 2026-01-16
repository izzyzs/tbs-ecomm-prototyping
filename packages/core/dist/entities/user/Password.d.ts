export declare class PasswordError extends Error {
    constructor(message: string);
}
export declare class Password {
    private password;
    private constructor();
    static create(password: string): Password;
    static validatePassword(password: string): boolean;
    get value(): string;
}
//# sourceMappingURL=Password.d.ts.map
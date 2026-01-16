export declare class EmailError extends Error {
    constructor(message: string);
}
export declare class Email {
    private email;
    private constructor();
    static create(email: string): Email;
    static validateEmail(email: string): boolean;
    get value(): string;
}
//# sourceMappingURL=Email.d.ts.map
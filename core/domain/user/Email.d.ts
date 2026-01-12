export declare class EmailError extends Error {
    constructor(message: string);
}
declare class Email {
    private email;
    private constructor();
    static create(email: string): Email;
    static validateEmail(email: string): boolean;
    get value(): string;
}
export default Email;
//# sourceMappingURL=Email.d.ts.map
export class EmailError extends Error {
    constructor(message) {
        super(message);
        this.name = "Email";
    }
}
export class Email {
    constructor(email) {
        this.email = email;
    }
    static create(email) {
        if (!Email.validateEmail(email)) {
            throw new EmailError("Email is invalid.");
        }
        return new Email(email);
    }
    static validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    ;
    get value() {
        return this.email;
    }
}

export class EmailError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "Email"
    }
}

export class Email {
    private constructor(
        private email: string
    ) {}

    static create(email: string): Email {
        if(!Email.validateEmail(email)) {
            throw new EmailError("Email is invalid.")
        }

        return new Email(email);
    }

    
    static validateEmail(email: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    get value(): string {
        return this.email;
    }
}
export class PasswordError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "Password"
    }
}

export class Password {
    private constructor(
        private password: string
    ) {}

    static create(password: string): Password {
        if(!Password.validatePassword(password)) {
            throw new PasswordError("Password is invalid. come check validation function")
        }

        return new Password(password);
    }

    // todo: edit validation function
    static validatePassword(password: string) {
        return password.length > 5;
    };

    get value() {
        return this.password;
    }
}
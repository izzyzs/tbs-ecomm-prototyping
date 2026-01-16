export class PasswordError extends Error {
    constructor(message) {
        super(message);
        this.name = "Password";
    }
}
export class Password {
    constructor(password) {
        this.password = password;
    }
    static create(password) {
        if (!Password.validatePassword(password)) {
            throw new PasswordError("Password is invalid. come check validation function");
        }
        return new Password(password);
    }
    // todo: edit validation function
    static validatePassword(password) {
        return password.length > 5;
    }
    ;
    get value() {
        return this.password;
    }
}

export class MoneyError extends Error {
    constructor(message) {
        super(message);
        this.name = "MoneyError";
    }
}
export class Money {
    constructor(valueInPennies) {
        this.pennies = Money.validatePennies(valueInPennies);
    }
    static validatePennies(valueInPennies) {
        if (valueInPennies < 0)
            throw new MoneyError("the value is negative and negative money doesn't exist");
        if (!Number.isSafeInteger(valueInPennies))
            throw new MoneyError("The value should be in pennies; this value has a fractional part.");
        return valueInPennies;
    }
    get valueInPennies() {
        return this.pennies;
    }
    get inDollars() {
        return this.pennies / 100;
    }
    add(other) {
        return new Money(this.pennies + other.pennies);
    }
    subtract(other) {
        return new Money(this.pennies - other.pennies);
    }
}

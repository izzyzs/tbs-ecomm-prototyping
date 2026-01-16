export class MoneyError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "MoneyError";
    }
}

export class Money {
    private readonly pennies: number;
    
    constructor(valueInPennies: number) {
        this.pennies = Money.validatePennies(valueInPennies);
    }

    static validatePennies(valueInPennies: number): number {
        if (valueInPennies < 0)
            throw new MoneyError("the value is negative and negative money doesn't exist")
        if (!Number.isSafeInteger(valueInPennies))
            throw new MoneyError("The value should be in pennies; this value has a fractional part.")
        return valueInPennies;
    }

    get valueInPennies(): number {
        return this.pennies;
    }
    
    get inDollars(): number {
        return this.pennies / 100;
    }
    
    add(other: Money): Money {
        return new Money(this.pennies + other.pennies)
    }

    subtract(other: Money): Money {
        return new Money(this.pennies - other.pennies)
    }

}
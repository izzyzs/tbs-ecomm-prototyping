export declare class MoneyError extends Error {
    constructor(message: string);
}
export declare class Money {
    private readonly pennies;
    constructor(valueInPennies: number);
    static validatePennies(valueInPennies: number): number;
    get valueInPennies(): number;
    get inDollars(): number;
    add(other: Money): Money;
    subtract(other: Money): Money;
}
//# sourceMappingURL=Money.d.ts.map
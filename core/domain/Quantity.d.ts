export declare class QuantityError extends Error {
    constructor(message: string);
}
export declare class Quantity {
    private readonly value;
    constructor(value: number);
    static validateQuantity(val: number): number;
    get amount(): number;
    increase(by?: number): Quantity;
    decrease(by?: number): Quantity;
}
//# sourceMappingURL=Quantity.d.ts.map
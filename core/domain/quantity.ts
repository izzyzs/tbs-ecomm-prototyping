export class QuantityError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "QuantityError";
    }
}

export class Quantity {
    private readonly value: number;

    constructor(value: number) {
        this.value = Quantity.validateQuantity(value);
    }

    static validateQuantity(val: number): number {
        if (val < 0) throw new QuantityError("val can't be negative");
        if (!Number.isSafeInteger(val)) throw new QuantityError("Can't have a fractional unit");
        return val;
    }

    get amount(): number {
        return this.value;
    }

    increase(by: number = 1): Quantity {
        return new Quantity(this.value + by);
    }

    decrease(by: number = 1): Quantity {
        return new Quantity(this.value - by);
    }
}

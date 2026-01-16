export class QuantityError extends Error {
    constructor(message) {
        super(message);
        this.name = "QuantityError";
    }
}
export class Quantity {
    constructor(value) {
        this.value = Quantity.validateQuantity(value);
    }
    static validateQuantity(val) {
        if (val < 0)
            throw new QuantityError("val can't be negative");
        if (!Number.isSafeInteger(val))
            throw new QuantityError("Can't have a fractional unit");
        return val;
    }
    get amount() {
        return this.value;
    }
    increase(by = 1) {
        return new Quantity(this.value + by);
    }
    decrease(by = 1) {
        return new Quantity(this.value - by);
    }
}

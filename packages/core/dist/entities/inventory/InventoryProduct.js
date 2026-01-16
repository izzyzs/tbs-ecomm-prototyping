export class InventoryProductError extends Error {
    constructor(message) {
        super(message);
        this.name = "InventoryProductError";
    }
}
export class InventoryProduct {
    constructor(id, name, quantity, category, price, cost, taxable, amountLimit, active, databaseId, lightspeedSystemId, description, brand) {
        this.id = id;
        if (!name.trim()) {
            throw new InventoryProductError("Product name is required");
        }
        if (!lightspeedSystemId.trim())
            throw new InventoryProductError("Lightspeed System Id required");
        if (!databaseId.trim())
            throw new InventoryProductError("Database Id required");
        InventoryProduct.validateAmountLimit(amountLimit, active);
        InventoryProduct.validateCost(cost);
        InventoryProduct.validatePrice(price, cost);
        this.name = name;
        this.description = description;
        this.brand = brand;
        this.quantity = quantity;
        this.category = category;
        this.price = price;
        this.cost = cost;
        this.taxable = taxable;
        this.amountLimit = amountLimit;
        this.active = active;
        this.lightspeedSystemId = lightspeedSystemId;
        this.databaseId = databaseId;
    }
    static validateCost(cost) {
        if (cost.valueInPennies <= 0)
            throw new InventoryProductError("Product cost must be greater than 0");
    }
    static validatePrice(price, cost) {
        if (price.valueInPennies <= cost.valueInPennies)
            throw new InventoryProductError("Price must be greater than cost.");
    }
    static validateAmountLimit(amountLimit, active) {
        if (amountLimit < 0)
            throw new InventoryProductError("Can't have negative amount limit");
        if (amountLimit == 0 && active)
            throw new InventoryProductError("If limit is set to 0, then product should be inactive");
    }
    // should I do
    increaseQuantity(by) {
        this.quantity = this.quantity.increase(by);
    }
    decreaseQuantity(by) {
        this.quantity = this.quantity.decrease(by);
    }
    // or
    changeQuantity(newQuantity, user) {
        if (user.role.value.kind in ["stock-keeper", "admin"]) {
            this.quantity = newQuantity;
        }
    }
    setAmountLimit(value) {
        InventoryProduct.validateAmountLimit(value, this.active);
        this.amountLimit = value;
    }
}
/*
constructor(name: string, description?: string, brand?: string, quantity: number) {
        this.name = name;
        this.description = description;
        this.brand = brand;
        this.quantity = InventoryProduct.validateQuantity(quantity)
    }

    static validateQuantity(quantity: number): number {
        if (quantity < 0)
            throw new InventoryProductError("quantity can't be negative");
        if (!Number.isSafeInteger(quantity))
            throw new InventoryProductError("Can't have a fractional unit");
        return quantity;
    }

*/

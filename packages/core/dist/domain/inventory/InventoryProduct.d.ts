import { Quantity } from "../Quantity";
import { Money } from "../Money";
import { User } from "../user/User";
import { Category } from "../category/Category";
import { ProductId } from "../Identity";
export declare class InventoryProductError extends Error {
    constructor(message: string);
}
export declare class InventoryProduct {
    private readonly id;
    private name;
    private description?;
    private brand?;
    private quantity;
    private category;
    private price;
    private cost;
    private taxable;
    private active;
    private amountLimit;
    private readonly lightspeedSystemId;
    private readonly databaseId;
    constructor(id: ProductId, name: string, quantity: Quantity, category: Category, price: Money, cost: Money, taxable: boolean, amountLimit: number, active: boolean, databaseId: string, lightspeedSystemId: string, description?: string, brand?: string);
    static validateCost(cost: Money): void;
    static validatePrice(price: Money, cost: Money): void;
    static validateAmountLimit(amountLimit: number, active: boolean): void;
    increaseQuantity(by: number): void;
    decreaseQuantity(by: number): void;
    changeQuantity(newQuantity: Quantity, user: User): void;
    setAmountLimit(value: number): void;
}
//# sourceMappingURL=InventoryProduct.d.ts.map
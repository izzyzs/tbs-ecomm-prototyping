import { Quantity } from "../Quantity";
import { ProductId, CartItemId } from "../Identity";
import { Money } from "../Money";
export declare class ProductUnavailableError extends Error {
    constructor(message: string);
}
export declare class CartItemNotFoundError extends Error {
    constructor(message: string);
}
export type CartItemDraft = {
    productId: ProductId;
    name: string;
    brand: string;
    price: Money;
    quantity: Quantity;
};
export declare class CartItem {
    readonly id: CartItemId;
    readonly productId: ProductId;
    readonly name: string;
    readonly brand: string;
    readonly price: Money;
    private quantity;
    constructor(id: CartItemId, productId: ProductId, name: string, brand: string, price: Money, quantity: Quantity);
    get quantityAmount(): number;
}
//# sourceMappingURL=CartItem.d.ts.map
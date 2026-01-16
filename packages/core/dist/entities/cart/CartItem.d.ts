import { Quantity } from "../../entities/index.js";
import { ProductId, CartItemId } from "../../entities/index.js";
import { Money } from "../../entities/index.js";
export declare class ProductUnavailableError extends Error {
    constructor(message: string);
}
declare class CartItemNotFoundError extends Error {
    constructor(message: string);
}
export default CartItemNotFoundError;
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
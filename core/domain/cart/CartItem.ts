import { Quantity } from "../Quantity";
import { ProductId, CartItemId } from "../Identity";
import { Money } from "../Money";

// TODO: move this to InventoryProduct or better yet,
// make an error export page
export class ProductUnavailableError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ProductUnavailableError";
    }
}

export class CartItemNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CartItemNotFoundError";
    }
}

export type CartItemDraft = {
    productId: ProductId;
    name: string;
    brand: string;
    price: Money;
    quantity: Quantity;
};
//  Omit<CartItem, "id" | "incrementQuantity" | "quantity" | "quantityAmount"> & Pick<Partial<CartItem>, "id">

export class CartItem {
    constructor(
        public readonly id: CartItemId,
        public readonly productId: ProductId,
        public readonly name: string,
        public readonly brand: string,
        public readonly price: Money,
        private quantity: Quantity
    ) {}

    get quantityAmount(): number {
        return this.quantity.amount;
    }
}

import { Quantity } from "../../entities/index.js";
import { ProductId, CartItemId } from "../../entities/index.js";
import { Money } from "../../entities/index.js";

// TODO: move this to InventoryProduct or better yet,
// make an error export page
export class ProductUnavailableError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ProductUnavailableError";
    }
}

class CartItemNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CartItemNotFoundError";
    }
}

export default CartItemNotFoundError

export class SKU {
    constructor(public readonly sku: string) {}

    get value() {
        return this.sku;
    }
}

export type CartItemDraft = {
    productId: ProductId;
    sku: SKU;
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
        public readonly sku: SKU,
        public readonly name: string,
        public readonly brand: string,
        public readonly price: Money,
        private quantity: Quantity
    ) {}

    get quantityAmount(): number {
        return this.quantity.amount;
    }
}

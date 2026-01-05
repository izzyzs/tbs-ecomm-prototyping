import { Quantity } from "../quantity";
import { ProductId, CartItemId } from "../identity";
import { Money } from "../money";


export class ProductUnavailableError extends Error{
    constructor(message: string) {
        super(message)
        this.name = "ProductUnavailableError"
    }
}

export type CartItemDraft = Omit<CartItem, "id" | "incrementQuantity" | "quantity" | "quantityAmount"> & Pick<Partial<CartItem>, "id">

export class CartItem {
    
    constructor(
        public readonly id: CartItemId,
        public readonly productId: ProductId,
        public readonly name: string,
        public readonly brand: string,
        public readonly price: Money,
        private quantity: Quantity,
    ) {}

    incrementQuantity() {
        this.quantity = this.quantity.increase()
    };

    get quantityAmount(): number {
        return this.quantity.amount
    }
}

// cart.ts
import { UserId, ProductId, CartId } from "../identity"
import { CartItem } from "./cart-item";
// export type CartOwner = { kind: "customer"; id: CustomerId}


export class Cart {
    
    constructor (
        private id: CartId,
        private readonly uId: UserId,
        private lineItems: CartItem[] = []
    ) {}

    get userId() {
        return this.uId;
    }


    findCartItem(productId: ProductId) {
        return this.lineItems.find(item => item.productId.number === productId.number)
    }


    addItem(item: CartItem) {
        this.lineItems.push(item)
    } 
}


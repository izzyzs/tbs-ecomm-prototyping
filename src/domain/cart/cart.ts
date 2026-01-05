// cart.ts
import { UserId, ProductId, CartId } from "../identity"
import { CartItem } from "./cart-item.domain";
import CartRepository from "@/domain/repositories/cart/AuthenticatedCartRepository";
// export type CartOwner = { kind: "customer"; id: CustomerId}


export class Cart {
    
    constructor (
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


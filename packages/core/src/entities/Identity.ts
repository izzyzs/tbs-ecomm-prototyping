export class UserId {
    constructor(
        private readonly id: string
    ) {}

    get value() {
        return this.id;
    }
}

export class StripeCheckoutId {
    constructor(
        private readonly id: string
    ) {}

    get value() {
        return this.id;
    }
}

export class OrderId {
    constructor(
       private readonly id: number
    ) {}

    get number() {
        return this.id;
    }
}

export class OrderItemId {
    constructor(
       private readonly id: number
    ) {}

    get number() {
        return this.id;
    }
}

export class CartItemId {
    constructor(
        private readonly id: number
    ) {}

    get number() {
        return this.id;
    }
}

export class CategoryId {
    constructor(
        private readonly id: number
    ) {}
    
    get number() {
        return this.id;
    }
}

export class CartId {
    constructor(
        private readonly id: number
    ) {}
    
    get number() {
        return this.id;
    }
}

export class ProductId {
    constructor(
        private readonly id: number
    ) {}
    
    get number() {
        return this.id;
    }
}

export type CartOwner = { kind: "Authenticated", userId: UserId, cartId: CartId } 
                      | { kind: "Guest" }
export declare class UserId {
    private readonly id;
    constructor(id: string);
    get value(): string;
}
export declare class StripeCheckoutId {
    private readonly id;
    constructor(id: string);
    get value(): string;
}
export declare class OrderId {
    private readonly id;
    constructor(id: number);
    get number(): number;
}
export declare class OrderItemId {
    private readonly id;
    constructor(id: number);
    get number(): number;
}
export declare class CartItemId {
    private readonly id;
    constructor(id: number);
    get number(): number;
}
export declare class CategoryId {
    private readonly id;
    constructor(id: number);
    get number(): number;
}
export declare class CartId {
    private readonly id;
    constructor(id: number);
    get number(): number;
}
export declare class ProductId {
    private readonly id;
    constructor(id: number);
    get number(): number;
}
export type CartOwner = {
    kind: "Authenticated";
    userId: UserId;
    cartId: CartId;
} | {
    kind: "Guest";
};
//# sourceMappingURL=Identity.d.ts.map
import { UserId, ProductId, CartId } from "../Identity";
import { CartItem } from "./CartItem";
export declare class Cart {
    private id;
    private readonly uId;
    private lineItems;
    constructor(id: CartId, uId: UserId, lineItems?: CartItem[]);
    get userId(): UserId;
    findCartItem(productId: ProductId): CartItem | undefined;
    addItem(item: CartItem): void;
}
//# sourceMappingURL=Cart.d.ts.map
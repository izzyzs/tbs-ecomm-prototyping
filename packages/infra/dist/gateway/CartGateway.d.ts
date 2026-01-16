import { LocalCartRepository } from "@tbs/core";
import { AuthenticatedCartRepository } from "@tbs/core";
import { CartItem, CartItemDraft } from "@tbs/core";
import { CartOwner, ProductId } from "@tbs/core";
export interface CartGateway {
    addCartItem(cartItemDraft: CartItemDraft, owner: CartOwner): Promise<CartItem>;
    decrementCartItem(cartItemDraft: CartItemDraft, owner: CartOwner): Promise<CartItem>;
    removeCartItem(productId: ProductId, owner: CartOwner): Promise<void>;
    retrieveSingleCartItem(productId: ProductId, owner: CartOwner): Promise<CartItem>;
}
export declare class DefaultCartGateway implements CartGateway {
    private localCartRepository;
    private authenticatedCartRepository;
    constructor(localCartRepository: LocalCartRepository, authenticatedCartRepository: AuthenticatedCartRepository);
    addCartItem(cartItemDraft: CartItemDraft, owner: CartOwner): Promise<CartItem>;
    decrementCartItem(cartItemDraft: CartItemDraft, owner: CartOwner): Promise<CartItem>;
    removeCartItem(productId: ProductId, owner: CartOwner): Promise<void>;
    retrieveSingleCartItem(productId: ProductId, owner: CartOwner): Promise<CartItem>;
}
//# sourceMappingURL=CartGateway.d.ts.map
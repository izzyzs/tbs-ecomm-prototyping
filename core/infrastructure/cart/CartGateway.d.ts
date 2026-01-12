import { LocalCartRepository } from "@/domain/repositories/cart/LocalCartRepository";
import { AuthenticatedCartRepository } from "@/domain/repositories/cart/AuthenticatedCartRepository";
import { CartItem, CartItemDraft } from "@/domain/cart/CartItem";
import { CartOwner, ProductId } from "@/domain/Identity";
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

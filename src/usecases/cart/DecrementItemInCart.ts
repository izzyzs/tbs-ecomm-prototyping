import { CartItem, CartItemDraft } from "@/domain/cart/cart-item";
import { CartItemId, CartOwner, ProductId } from "@/domain/identity";
import { Quantity } from "@/domain/quantity";
import { CartGateway } from "@/infrastructure/cart/CartGateway";
import CartItemMapper from "@/interface-adapters/mappers/cart-item.mapper";


export class DecrementItemInCart {
    constructor(private cartGateway: CartGateway) {}

    async execute(cartItemId: CartItemId, owner: CartOwner): Promise<CartItem> {
        const cartItem = await this.cartGateway.retrieveSingleCartItem(cartItemId, owner);

        if (cartItem.quantityAmount == 1) {
            await this.cartGateway.removeCartItem(cartItem.productId, owner);
            return new CartItem(cartItem.id, cartItem.productId, cartItem.name, cartItem.brand, cartItem.price, new Quantity(0));
        }

        const oldItem = CartItemMapper.toDraftFromDomain(cartItem)
        const newQuantity = new Quantity(cartItem.quantityAmount - 1)
        const newItem: CartItemDraft = { ...oldItem, quantity: newQuantity }
        const decrementedCartItem = await this.cartGateway.decrementCartItem(newItem, owner);
        return decrementedCartItem;
    }
}
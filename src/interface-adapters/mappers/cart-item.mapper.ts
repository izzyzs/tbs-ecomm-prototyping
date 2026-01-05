import { CartItem } from "@/domain/cart/cart-item.domain"
import { CartItemId, ProductId } from "@/domain/identity"
import { Quantity } from "@/domain/quantity"
import { Money } from "@/domain/money"
import { CartItemState } from "@/utils/types"


class CartMapper {
    static toStateFromDomain(item: CartItem): CartItemState {
        const itemState: CartItemState = {
            id: item.id.number,
            productId: item.productId.number,
            name: item.name,
            brand: item.brand,
            price: item.price.inDollars,
            quantity: item.quantityAmount
        }
    
        return itemState;
    }

    static toDomainFromState(itemState: CartItemState): CartItem {
        const priceInPennies = itemState.price * 100

        const item: CartItem = new CartItem(
            new CartItemId(itemState.id), 
            new ProductId(itemState.productId),
            itemState.name,
            itemState.brand,
            new Money(priceInPennies),
            new Quantity(itemState.quantity)
        )
        
        return item;
    }

}

export default CartMapper;
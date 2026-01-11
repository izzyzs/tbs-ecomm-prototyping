import { CartItem, CartItemDraft } from "@/domain/cart/cart-item"
import { CartItemId, ProductId } from "@/domain/identity"
import { Quantity } from "@/domain/quantity"
import { Money } from "@/domain/money"
import { CartItemState } from "@/utils/types"
import { LocalCartStorageDTO } from "@/domain/repositories/cart/LocalCartRepository"


class CartItemMapper {
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

    static toLocalDTOFromDraft(itemDraft: CartItemDraft, qty: Quantity): LocalCartStorageDTO {
        const priceInPennies = itemDraft.price.valueInPennies

        const item: LocalCartStorageDTO = {
            productId: itemDraft.productId.number,
            name: itemDraft.name,
            brand: itemDraft.brand,
            price: priceInPennies,
            quantity: qty.amount,
        }

        return item;
    }

    static toDomainFromLocalDTO(id: CartItemId, localItemDTO: LocalCartStorageDTO): CartItem {
        const item = new CartItem(
            id,
            new ProductId(localItemDTO.productId),
            localItemDTO.name,
            localItemDTO.brand,
            new Money(localItemDTO.price),
            new Quantity(localItemDTO.quantity)
        )

        return item;
    }

}

export default CartItemMapper;
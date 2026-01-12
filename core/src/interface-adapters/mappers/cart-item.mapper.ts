import { CartItem, CartItemDraft } from "@/core/domain/cart/cart-item"
import { CartItemId, ProductId } from "@/core/domain/identity"
import { Quantity } from "@/core/domain/quantity"
import { Money } from "@/core/domain/money"
import { CartItemState } from "@/utils/types"
import { LocalCartStorageDTO } from "@/core/domain/repositories/cart/LocalCartRepository"


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

    static toLocalDTOFromDraft(itemDraft: CartItemDraft): LocalCartStorageDTO {
        const priceInPennies = itemDraft.price.valueInPennies

        const item: LocalCartStorageDTO = {
            productId: itemDraft.productId.number,
            name: itemDraft.name,
            brand: itemDraft.brand,
            price: priceInPennies,
            quantity: itemDraft.quantity.amount,
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

    static toDraftFromDomain(item: CartItem): CartItemDraft {
        const draft: CartItemDraft = {
            productId: item.productId,
            name: item.name,
            brand: item.brand,
            price: item.price,
            quantity: new Quantity(item.quantityAmount)
        }

        return draft;
    }

}

export default CartItemMapper;
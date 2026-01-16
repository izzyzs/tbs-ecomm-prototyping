import { CartItem } from "@tbs/core";
import { ProductId } from "@tbs/core";
import { Quantity } from "@tbs/core";
import { Money } from "@tbs/core";
export class CartItemMapper {
    static toLocalDTOFromDraft(itemDraft) {
        const priceInPennies = itemDraft.price.valueInPennies;
        const item = {
            productId: itemDraft.productId.number,
            name: itemDraft.name,
            brand: itemDraft.brand,
            price: priceInPennies,
            quantity: itemDraft.quantity.amount,
        };
        return item;
    }
    static toDomainFromLocalDTO(id, localItemDTO) {
        const item = new CartItem(id, new ProductId(localItemDTO.productId), localItemDTO.name, localItemDTO.brand, new Money(localItemDTO.price), new Quantity(localItemDTO.quantity));
        return item;
    }
    static toDraftFromDomain(item) {
        const draft = {
            productId: item.productId,
            name: item.name,
            brand: item.brand,
            price: item.price,
            quantity: new Quantity(item.quantityAmount),
        };
        return draft;
    }
}

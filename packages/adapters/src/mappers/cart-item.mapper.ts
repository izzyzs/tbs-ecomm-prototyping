import { CartItem, CartItemDraft } from "@tbs/core";
import { CartItemId, ProductId } from "@tbs/core";
import { Quantity } from "@tbs/core";
import { Money } from "@tbs/core";
import { LocalCartStorageDTO } from "@tbs/core";

export class CartItemMapper {
    static toLocalDTOFromDraft(itemDraft: CartItemDraft): LocalCartStorageDTO {
        const priceInPennies = itemDraft.price.valueInPennies;

        const item: LocalCartStorageDTO = {
            productId: itemDraft.productId.number,
            name: itemDraft.name,
            brand: itemDraft.brand,
            price: priceInPennies,
            quantity: itemDraft.quantity.amount,
        };

        return item;
    }

    static toDomainFromLocalDTO(id: CartItemId, localItemDTO: LocalCartStorageDTO): CartItem {
        const item = new CartItem(id, new ProductId(localItemDTO.productId), localItemDTO.name, localItemDTO.brand, new Money(localItemDTO.price), new Quantity(localItemDTO.quantity));

        return item;
    }

    static toDraftFromDomain(item: CartItem): CartItemDraft {
        const draft: CartItemDraft = {
            productId: item.productId,
            name: item.name,
            brand: item.brand,
            price: item.price,
            quantity: new Quantity(item.quantityAmount),
        };

        return draft;
    }
}
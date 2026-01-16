import { CartItem, CartItemDraft } from "@tbs/core";
import { CartItemId } from "@tbs/core";
import { LocalCartStorageDTO } from "@tbs/core";
export declare class CartItemMapper {
    static toLocalDTOFromDraft(itemDraft: CartItemDraft): LocalCartStorageDTO;
    static toDomainFromLocalDTO(id: CartItemId, localItemDTO: LocalCartStorageDTO): CartItem;
    static toDraftFromDomain(item: CartItem): CartItemDraft;
}
//# sourceMappingURL=cart-item.mapper.d.ts.map
import { CartItem, CartItemDraft } from "@/core/domain/cart/cart-item";
import { CartItemId } from "@/core/domain/identity";
import { CartItemState } from "@/utils/types";
import { LocalCartStorageDTO } from "@/core/domain/repositories/cart/LocalCartRepository";
declare class CartItemMapper {
    static toStateFromDomain(item: CartItem): CartItemState;
    static toDomainFromState(itemState: CartItemState): CartItem;
    static toLocalDTOFromDraft(itemDraft: CartItemDraft): LocalCartStorageDTO;
    static toDomainFromLocalDTO(id: CartItemId, localItemDTO: LocalCartStorageDTO): CartItem;
    static toDraftFromDomain(item: CartItem): CartItemDraft;
}
export default CartItemMapper;
//# sourceMappingURL=cart-item.mapper.d.ts.map
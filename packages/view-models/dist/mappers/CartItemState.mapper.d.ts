import { CartItemState } from "../types/index.js";
import { CartItem } from "@tbs/core";
export declare class CartItemStateMapper {
    static toStateFromDomain(item: CartItem): CartItemState;
    static toDomainFromState(itemState: CartItemState): CartItem;
}
//# sourceMappingURL=CartItemState.mapper.d.ts.map
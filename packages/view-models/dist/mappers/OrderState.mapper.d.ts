import { OrderState } from "../types/OrderState.type.js";
import { Order, UserId } from "@tbs/core";
export declare class OrderStateMapper {
    static domainToState(order: Order): OrderState;
    static stateToDomain(state: OrderState, userId: UserId): Order;
}
//# sourceMappingURL=OrderState.mapper.d.ts.map
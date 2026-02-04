import {CartItemState} from "@tbs/view-models";

export type HandleCheckoutBodyType = { cartItems: CartItemState[], email: string, customer_id: string };
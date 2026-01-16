// export type CartOwner = { kind: "customer"; id: CustomerId}
export class Cart {
    constructor(id, uId, lineItems = []) {
        this.id = id;
        this.uId = uId;
        this.lineItems = lineItems;
    }
    get userId() {
        return this.uId;
    }
    findCartItem(productId) {
        return this.lineItems.find((item) => item.productId.number === productId.number);
    }
    addItem(item) {
        this.lineItems.push(item);
    }
}

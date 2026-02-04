// TODO: move this to InventoryProduct or better yet,
// make an error export page
export class ProductUnavailableError extends Error {
    constructor(message) {
        super(message);
        this.name = "ProductUnavailableError";
    }
}
class CartItemNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "CartItemNotFoundError";
    }
}
export default CartItemNotFoundError;
export class SKU {
    constructor(sku) {
        this.sku = sku;
    }
    get value() {
        return this.sku;
    }
}
//  Omit<CartItem, "id" | "incrementQuantity" | "quantity" | "quantityAmount"> & Pick<Partial<CartItem>, "id">
export class CartItem {
    constructor(id, productId, sku, name, brand, price, quantity) {
        this.id = id;
        this.productId = productId;
        this.sku = sku;
        this.name = name;
        this.brand = brand;
        this.price = price;
        this.quantity = quantity;
    }
    get quantityAmount() {
        return this.quantity.amount;
    }
}

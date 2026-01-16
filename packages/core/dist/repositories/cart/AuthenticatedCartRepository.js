export class CartItemCreationError extends Error {
    constructor(message) {
        super(message);
        this.name = "CartItemCreationError";
    }
}

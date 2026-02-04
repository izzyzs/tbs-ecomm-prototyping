import { CartItem, SKU } from "@tbs/core";
import { CartId, CartItemId, ProductId } from "@tbs/core";
import { Money } from "@tbs/core";
import { Quantity } from "@tbs/core";
export const mockItem1 = new CartItem(new CartItemId(1), new ProductId(1), new SKU("1738"), "Product 1", "This is the first product", new Money(1000), new Quantity(1));
export const mockItem2 = new CartItem(new CartItemId(2), new ProductId(2), new SKU("1738"), "Product 2", "This is the second product", new Money(2000), new Quantity(2));
export const mockItem3 = new CartItem(new CartItemId(3), new ProductId(3), new SKU("1738"), "Product 3", "This is the third product", new Money(3000), new Quantity(3));
export const mockCartItems = [mockItem1, mockItem2, mockItem3];
const authCartAddedItem = new CartItem(new CartItemId(4), new ProductId(4), new SKU("1738"), "Product 4", "This is the fourth product", new Money(4000), new Quantity(4));
export const mockAuthenticatedCartRepository = {
    ensureCart: async () => new CartId(1),
    retrieveCartItems: async () => mockCartItems,
    upsertCartItem: async () => authCartAddedItem,
    syncLocalCartWithDB: async () => { },
    retrieveSingleCartItem: async () => mockCartItems[1],
    decrementCartItem: async () => mockCartItems[1],
    removeCartItem: async () => { },
};
export const mockLocalCartRepository = {
    saveCart: async () => { },
    retrieveSingleCartItem: async () => mockItem2,
    retrieveCartItems: async () => mockCartItems,
    upsertCartItem: async () => localCartAddedItem,
    decrementCartItem: async () => mockItem1,
    removeCartItem: async () => { },
};
export const localCartItemDraft = {
    productId: new ProductId(67),
    sku: new SKU("1738"),
    quantity: new Quantity(6),
    name: "localCartItemDraft",
    brand: "Local Cart",
    price: new Money(6767),
};
const localCartAddedItem = new CartItem(new CartItemId(8), localCartItemDraft.productId, localCartItemDraft.sku, localCartItemDraft.name, localCartItemDraft.brand, localCartItemDraft.price, new Quantity(8));

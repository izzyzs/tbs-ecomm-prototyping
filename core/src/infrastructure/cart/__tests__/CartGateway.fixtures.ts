import { CartItem, CartItemDraft } from "@/domain/cart/CartItem";
import { CartId, CartItemId, ProductId } from "@/domain/Identity";
import { Money } from "@/domain/Money";
import { Quantity } from "@/domain/Quantity";
import { AuthenticatedCartRepository } from "@/domain/repositories/cart/AuthenticatedCartRepository";
import { LocalCartRepository } from "@/domain/repositories/cart/LocalCartRepository";

export const mockItem1: CartItem = new CartItem(new CartItemId(1), new ProductId(1), "Product 1", "This is the first product", new Money(1000), new Quantity(1));
export const mockItem2: CartItem = new CartItem(new CartItemId(2), new ProductId(2), "Product 2", "This is the second product", new Money(2000), new Quantity(2));

export const mockItem3: CartItem = new CartItem(new CartItemId(3), new ProductId(3), "Product 3", "This is the third product", new Money(3000), new Quantity(3));

export const mockCartItems = [mockItem1, mockItem2, mockItem3];

const authCartAddedItem = new CartItem(new CartItemId(4), new ProductId(4), "Product 4", "This is the fourth product", new Money(4000), new Quantity(4));

export const mockAuthenticatedCartRepository: AuthenticatedCartRepository = {
    ensureCart: async () => new CartId(1),
    retrieveCartItems: async () => mockCartItems,
    addCartItem: async () => authCartAddedItem,
    syncLocalCartWithDB: async () => {},
};

export const mockLocalCartRepository: LocalCartRepository = {
    saveCart: async () => {},
    retrieveCartItems: async () => mockCartItems,
    addCartItem: async () => localCartAddedItem,
};

export const localCartItemDraft: CartItemDraft = {
    productId: new ProductId(67),
    name: "localCartItemDraft",
    brand: "Local Cart",
    price: new Money(6767),
};

const localCartAddedItem = new CartItem(new CartItemId(8), localCartItemDraft.productId, localCartItemDraft.name, localCartItemDraft.brand, localCartItemDraft.price, new Quantity(8));

import { test, expect } from "vitest";
import { CartGateway, DefaultCartGateway } from "../CartGateway.js";
import { CartOwner } from "@tbs/core";
import { mockLocalCartRepository, mockAuthenticatedCartRepository, localCartItemDraft } from "./CartGateway.fixtures.js";

test("CartGateway adds to local cart when guest user", async () => {
    const guest: CartOwner = { kind: "Guest" };
    const cartGateway = new DefaultCartGateway(mockLocalCartRepository, mockAuthenticatedCartRepository);
    expect((await cartGateway.addCartItem(localCartItemDraft, guest)).name).toBe("localCartItemDraft");
});

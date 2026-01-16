import { test, expect } from "vitest";
import { DefaultCartGateway } from "../CartGateway.js";
import { mockLocalCartRepository, mockAuthenticatedCartRepository, localCartItemDraft } from "./CartGateway.fixtures.js";
test("CartGateway adds to local cart when guest user", async () => {
    const guest = { kind: "Guest" };
    const cartGateway = new DefaultCartGateway(mockLocalCartRepository, mockAuthenticatedCartRepository);
    expect((await cartGateway.addCartItem(localCartItemDraft, guest)).name).toBe("localCartItemDraft");
});

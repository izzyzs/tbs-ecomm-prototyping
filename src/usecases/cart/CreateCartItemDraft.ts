import { CartItemDraft } from "@/domain/cart/cart-item";
import { ProductId } from "@/domain/identity";
import { Money } from "@/domain/money";
import { Quantity } from "@/domain/quantity";
import InventoryRepository from "@/domain/repositories/inventory/InventoryRepository";

export class CreateCartItemDraft {
    constructor (
        private inventoryRepository: InventoryRepository
    ) {}

    async execute(productId: ProductId): Promise<CartItemDraft | null> {
        const cartItemDetails = await this.inventoryRepository.getProductDetailsForCartItems(productId);
        if (!cartItemDetails) return null;

        const itemDraft: CartItemDraft = {
            productId: new ProductId(cartItemDetails.id),
            name: cartItemDetails.name,
            brand: cartItemDetails.brand,
            price: new Money(+cartItemDetails.price.replace(/\$|\./g, "")),
            quantity: new Quantity(0)
        };
        return itemDraft;
    }
}
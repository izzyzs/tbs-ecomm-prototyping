import {CartItemDraft, ProductId, Money, Quantity, InventoryRepository, SKU} from "@tbs/core";
import { InventoryMapper } from "@tbs/adapters";

export class CreateCartItemDraft {
    constructor (
        private inventoryRepository: InventoryRepository
    ) {}

    async execute(productId: ProductId): Promise<CartItemDraft | null> {
        const cartItemDetails = await this.inventoryRepository.getProductDetailsForCartItems(productId);
        if (!cartItemDetails) return null;

        return {
            productId: new ProductId(cartItemDetails.id),
            name: cartItemDetails.name,
            brand: cartItemDetails.brand,
            price: InventoryMapper.priceDBtoDomain(cartItemDetails.price),
            sku: new SKU(cartItemDetails.sku),
            quantity: new Quantity(0)
        };

    }
}
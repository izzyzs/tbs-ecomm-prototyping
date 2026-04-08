import { ProductId } from "@/entities/index.js";
export type CartItemDetails = {
    id: number;
    name: string;
    brand: string;
    priceInPennies: number;
    sku: string;
} | null;
export interface InventoryRepository {
    getProductDetailsForCartItems(productId: ProductId): Promise<CartItemDetails | null>;
    getMaxPurchaseQuantity(productId: ProductId): Promise<number>;
}
//# sourceMappingURL=InventoryRepository.d.ts.map
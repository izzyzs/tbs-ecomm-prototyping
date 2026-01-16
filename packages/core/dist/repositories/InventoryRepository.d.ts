import { ProductId } from "@/entities/index.js";
export type CartItemDetails = {
    id: number;
    name: string;
    brand: string;
    price: string;
} | null;
export interface InventoryRepository {
    getProductDetailsForCartItems(productId: ProductId): Promise<CartItemDetails | null>;
}
//# sourceMappingURL=InventoryRepository.d.ts.map
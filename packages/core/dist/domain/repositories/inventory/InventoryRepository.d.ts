import { InventoryProduct } from "@/domain/inventory/InventoryProduct";
import { ProductId } from "@/domain/Identity";
export type CartItemDetails = {
    id: number;
    name: string;
    brand: string;
    price: string;
} | null;
interface InventoryRepository {
    getProductById(id: string): Promise<InventoryProduct>;
    getProductsByBrand(brand: string): Promise<InventoryProduct[]>;
    getProductDetailsForCartItems(productId: ProductId): Promise<CartItemDetails | null>;
}
export default InventoryRepository;
//# sourceMappingURL=InventoryRepository.d.ts.map
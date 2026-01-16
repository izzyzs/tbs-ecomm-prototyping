import { InventoryProduct } from "@/entities";
import { ProductId } from "@/entities";
export type CartItemDetails = {
    id: number;
    name: string;
    brand: string;
    price: string;
} | null;
interface InventoryRepository {
    getProductById(id: number): Promise<InventoryProduct>;
    getProductsByBrand(brand: string): Promise<InventoryProduct[]>;
    getProductDetailsForCartItems(productId: ProductId): Promise<CartItemDetails | null>;
}
export default InventoryRepository;
//# sourceMappingURL=InventoryRepository.d.ts.map
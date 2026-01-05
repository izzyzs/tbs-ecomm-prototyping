import { Quantity } from "@/domain/quantity";
import { InventoryProduct } from "@/domain/inventory/inventory-product";

interface InventoryRepository {
    getQuantityById(id: string): Promise<Quantity | null>;
    getProductById(id: string): Promise<InventoryProduct | null>;
    getProductsByBrand(brand: string): Promise<InventoryProduct[] | null>;
}

export default InventoryRepository;
import { Quantity } from "@/core/domain/quantity";
import { InventoryProduct } from "@/core/domain/inventory/inventory-product";
import { ProductId } from "@/core/domain/identity";

export type CartItemDetails = {
    id: number;
    name: string;
    brand: string;
    price: string;
} | null

interface InventoryRepository {
    // getQuantityById(id: string): Promise<Quantity | null>;
    getProductById(id: string): Promise<InventoryProduct>;
    getProductsByBrand(brand: string): Promise<InventoryProduct[]>;
    getProductDetailsForCartItems(productId: ProductId): Promise<CartItemDetails | null>;
}

export default InventoryRepository;
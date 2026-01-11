import { Quantity } from "@/domain/quantity";
import { InventoryProduct } from "@/domain/inventory/inventory-product";
import { ProductId } from "@/domain/identity";

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
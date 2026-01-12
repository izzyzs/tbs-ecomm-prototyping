import { Quantity } from "@/domain/Quantity";
import { InventoryProduct } from "@/domain/inventory/InventoryProduct";
import { ProductId } from "@/domain/Identity";

export type CartItemDetails = {
    id: number;
    name: string;
    brand: string;
    price: string;
} | null;

interface InventoryRepository {
    // getQuantityById(id: string): Promise<Quantity | null>;
    getProductById(id: string): Promise<InventoryProduct>;
    getProductsByBrand(brand: string): Promise<InventoryProduct[]>;
    getProductDetailsForCartItems(productId: ProductId): Promise<CartItemDetails | null>;
}

export default InventoryRepository;

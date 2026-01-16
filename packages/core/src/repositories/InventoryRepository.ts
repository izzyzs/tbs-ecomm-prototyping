import { InventoryProduct } from "@/entities/index.js";
import { ProductId } from "@/entities/index.js";

export type CartItemDetails = {
    id: number;
    name: string;
    brand: string;
    price: string;
} | null;

export interface InventoryRepository {
    // getQuantityById(id: string): Promise<Quantity | null>;
    // getProductById(id: number): Promise<InventoryProduct>;
    // getProductsByBrand(brand: string): Promise<InventoryProduct[]>;
    getProductDetailsForCartItems(productId: ProductId): Promise<CartItemDetails | null>;
}


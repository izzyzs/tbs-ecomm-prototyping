import InventoryRepository from "@/domain/repositories/InventoryRepository";
import { GetCartItem } from "./GetCartItem";

export class AddItemToCart {
    constructor(
        private getCartItem: GetCartItem,
        private inventoryRepository: InventoryRepository
    ) {}

    execute(): {} {
        try {
            this.getCartItem.execute()
        } catch (e) {

        }
    }
}
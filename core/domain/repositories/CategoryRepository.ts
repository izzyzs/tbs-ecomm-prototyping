import { CategoryId } from "../Identity";
import { Category } from "./category";

export interface CategoryRepository {
    getParentCategory(current: CategoryId): Promise<Category | null>;
}

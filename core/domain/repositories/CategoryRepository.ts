import { CategoryId } from "../identity";
import { Category } from "./category";

export interface CategoryRepository {
    getParentCategory(current: CategoryId): Promise<Category | null>
}
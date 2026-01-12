import { CategoryId } from "../Identity";
import { Category } from "./Category";
export interface CategoryRepository {
    getParentCategory(current: CategoryId): Promise<Category | null>;
}
//# sourceMappingURL=CategoryRepository.d.ts.map

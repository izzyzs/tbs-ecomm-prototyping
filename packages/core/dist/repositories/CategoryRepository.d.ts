import { CategoryId } from "@/entities/index.js";
import { Category } from "@/entities/index.js";
export interface CategoryRepository {
    getParentCategory(current: CategoryId): Promise<Category | null>;
}
//# sourceMappingURL=CategoryRepository.d.ts.map
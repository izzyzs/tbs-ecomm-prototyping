import { CategoryId } from "../entities/index.js";
import { CategoryRepository } from "../repositories/index.js";
export declare class Category {
    readonly id: CategoryId;
    private categoryRepository;
    readonly parentCategoryId?: CategoryId | undefined;
    constructor(id: CategoryId, categoryRepository: CategoryRepository, parentCategoryId?: CategoryId | undefined);
    parent(): Promise<Category | null>;
}
//# sourceMappingURL=Category.d.ts.map
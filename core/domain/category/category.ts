import { CategoryId } from "../Identity";
import { CategoryRepository } from "./CategoryRepository";

export class Category {
    constructor(
        public readonly id: CategoryId,
        private categoryRepository: CategoryRepository,
        public readonly parentCategoryId?: CategoryId
    ) {}

    async parent(): Promise<Category | null> {
        const parent = await this.categoryRepository.getParentCategory(this.id);
        return parent;
    }
}

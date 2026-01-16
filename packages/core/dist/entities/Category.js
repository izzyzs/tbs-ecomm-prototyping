export class Category {
    constructor(id, categoryRepository, parentCategoryId) {
        this.id = id;
        this.categoryRepository = categoryRepository;
        this.parentCategoryId = parentCategoryId;
    }
    async parent() {
        const parent = await this.categoryRepository.getParentCategory(this.id);
        return parent;
    }
}

import { Database } from "@/lib/supabase/database.types";

import { Branded } from "@/lib/brand";

export type CategoryId = Branded<number, "CategoryId">;
export type Name = Branded<string, "Name">;
export type Path = Branded<string, "Path">;
export type Slug = Branded<string, "Slug">;
type UpdateCategory = Database["public"]["Tables"]["categories"]["Update"];
type InsertCategory = Database["public"]["Tables"]["categories"]["Insert"];

export class Category {
    private readonly id: CategoryId;
    private name: Name;
    private childrenCategories?: Category[];
    private parentCategory?: Category;
    private path: Path;

    constructor(id: number, name: string, path: string, parent?: Category) {
        this.id = id as CategoryId;
        this.name = name as Name;
        this.path = path as Path;
        this.parentCategory = parent;
    }

    toInsert(): InsertCategory {}
}

export interface CategoryRepository {
    findChildren(currentId: CategoryId): Promise<Category[]>;
    setParent(currentId: CategoryId, parentId: CategoryId): Promise<Category>;
    // create
    createCategory(category: Category): Promise<Category>;
    // read
    getCategories(): Promise<Category[]>;
    getCategoryById(id: CategoryId): Promise<Category>;
    // update
    updateCategory(id: CategoryId, updateData: UpdateCategory): Promise<Category>;
    // delete
    deleteCategory(id: CategoryId): Promise<Category>;
}

/*
 name: string
 depth: number     | integer |           | not null | 
 slug: string      | text    |           |          | 
 path: string      | ltree   |           |          | 
 id: int        | bigint  |           | not null | generated always as identity
 parent_id
 */

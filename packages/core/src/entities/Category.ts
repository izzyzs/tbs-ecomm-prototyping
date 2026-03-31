import { CategoryId } from "../entities/index.js";
import { CategoryRepository } from "../repositories/index.js";

export class Category {
    constructor(
        public readonly id: CategoryId,
        private categoryRepository: CategoryRepository,
        public readonly parentCategoryId?: CategoryId,
    ) {}

    async parent(): Promise<Category | null> {
        const parent = await this.categoryRepository.getParentCategory(this.id);
        return parent;
    }
}

/**
 * 
 * After looking at [CategoryDisplay.tsx](/Users/ismaelz/Dropbox/Ben_n_Family/Ismael_Z/Documents/Career/Programming/Business/tbs-ecommerce/applications/packages/store-front/src/components/search/CategoryDisplay.tsx), [shop/page.tsx](/Users/ismaelz/Dropbox/Ben_n_Family/Ismael_Z/Documents/Career/Programming/Business/tbs-ecommerce/applications/packages/store-front/src/app/shop/page.tsx), and [ProductCategories.tsx](/Users/ismaelz/Dropbox/Ben_n_Family/Ismael_Z/Documents/Career/Programming/Business/tbs-ecommerce/applications/packages/store-front/src/components/nav/ProductCategories.tsx), the main issue is upstream of the UI:

`CategoryDisplay` is flat, because the page is feeding it flat data.

Right now:
- `CategoryDisplay` expects `CategoryObject[]`, which is just `{ category: string }`
- the shop page fetches `unique_categories_from_inventory`
- so the parent/child structure is already gone before rendering starts

That means if you want it to feel native to an adjacency-table model, the component should stop thinking in “unique strings” and start thinking in “nodes.”

**Best-fit solutions**

1. Recursive accordion backed by a full category tree
- Fetch the same kind of tree shape you already use in the navbar via `get_category_tree`.
- Render categories recursively:
  - if node has no children, show a leaf link
  - if node has children, show an accordion trigger and recurse inside
- This is the cleanest match to adjacency storage.
- It also handles arbitrary depth naturally.

Pros:
- closest to your actual data model
- one fetch
- simplest mental model once the data shape is correct

Cons:
- requires changing the data contract for the shop page and `CategoryDisplay`
- nested accordions can get visually heavy if the tree is huge

2. Fetch flat adjacency rows and build the tree in the UI
- Pull `id`, `parent_id`, `name`, `slug`, maybe `path`
- Build a tree client-side before rendering the accordion

Pros:
- closest to the raw table
- less dependency on custom RPC shape

Cons:
- you’re pushing tree-building logic into the frontend
- duplicates transformation work you already seem to have solved with `get_category_tree`

3. Lazy-loaded accordion by `parent_id`
- Load root categories first
- When a node opens, fetch its children
- Repeat by depth

Pros:
- good if category count is very large
- smaller initial payload

Cons:
- more state complexity
- loading spinners at every level
- feels worse unless the tree is truly large

4. Tree-view instead of accordion
- Still adjacency-based, but use an explorer/tree pattern rather than nested accordion blocks
- Better if depth is 4+ and categories are dense

Pros:
- often better UX than accordion for deep hierarchies
- easier to show active branch

Cons:
- slightly more custom interaction design
- less “standard storefront filter” feeling

**What I’d recommend**
Use option 1: a recursive tree from `get_category_tree`, rendered as a multilayer accordion.

Reason:
- you already have a tree RPC
- it avoids N+1 `parent()` / child lookups
- it reflects the adjacency table without exposing the raw table shape directly to the UI
- it gives you a reusable category shape for both navbar and shop browsing

**Important design decisions**
Before building it, I’d decide these explicitly:

- Should parent categories be clickable, expandable, or both?
  - If both, the trigger and the link should be separate controls.
  - This is usually the right choice.

- Do products live only on leaf categories, or also on parent categories?
  - If parent categories can have products, they should navigate.
  - If not, they can behave more like folders.

- Should opening a deep child auto-open its ancestors based on the current URL?
  - I would say yes. Otherwise the current category can be hidden inside collapsed parents.

- Do you want “browse all” at each branch?
  - Example: open “Hair Extension” and still have a direct link for the whole branch, not only its children.

- Is the shop page a category browser, a filter panel, or both?
  - If it’s the main browsing surface, the category tree should feel navigational.
  - If it’s a filter sidebar, the interaction should be lighter and more collapsible.

**One thing I would not do**
I would not try to make the UI walk the adjacency table one node at a time through something like `Category.parent()` in the browser. That’s domain-correct, but bad UI plumbing. For the storefront, you want one bulk tree payload or one bulk flat list, not per-node relationship chasing.

If you want, I can next outline what the ideal category node shape and accordion interaction model should be before any code changes.
 * 


////////////////////
NEW CONTEXT
////////////////////


I’m working in a pnpm monorepo. I want to redesign the storefront category browsing UI in `packages/store-front/src/app/shop` so it matches how categories are actually stored: an adjacency table with `parent_id`.

Current relevant files:
- `/Users/ismaelz/Dropbox/Ben_n_Family/Ismael_Z/Documents/Career/Programming/Business/tbs-ecommerce/applications/packages/store-front/src/app/shop/page.tsx`
- `/Users/ismaelz/Dropbox/Ben_n_Family/Ismael_Z/Documents/Career/Programming/Business/tbs-ecommerce/applications/packages/store-front/src/components/search/CategoryDisplay.tsx`
- `/Users/ismaelz/Dropbox/Ben_n_Family/Ismael_Z/Documents/Career/Programming/Business/tbs-ecommerce/applications/packages/store-front/src/utils/types.ts`
- `/Users/ismaelz/Dropbox/Ben_n_Family/Ismael_Z/Documents/Career/Programming/Business/tbs-ecommerce/applications/packages/store-front/src/components/nav/ProductCategories.tsx`
- `/Users/ismaelz/Dropbox/Ben_n_Family/Ismael_Z/Documents/Career/Programming/Business/tbs-ecommerce/applications/packages/core/src/entities/Category.ts`

Current state:
- `shop/page.tsx` fetches from `unique_categories_from_inventory`.
- It stores categories as `CategoryObject[]`.
- `CategoryObject` is currently just `{ category: string }`.
- `CategoryDisplay.tsx` renders those categories as a flat grid of links/cards.
- This is the main problem: the tree structure is already lost before rendering, so the UI cannot represent adjacency-table hierarchy cleanly.

Important existing context:
- The database/category model is adjacency-table based with `parent_id`.
- There is already a Supabase RPC named `get_category_tree`.
- The navbar category component already uses that RPC and a tree-like type:
  `type CategoryRow = { id: number; name: string; parent_id: number; depth: number; slug: string; path: string; children: CategoryRow[] }`
- That file is:
  `/Users/ismaelz/Dropbox/Ben_n_Family/Ismael_Z/Documents/Career/Programming/Business/tbs-ecommerce/applications/packages/store-front/src/components/nav/ProductCategories.tsx`
- I want the shop category browser to work seamlessly with this hierarchical structure instead of flat strings.

What I want:
- Replace the current flat `CategoryDisplay` concept with a multilayered accordion or tree-style browser that reflects the actual category hierarchy.
- It should feel natural for arbitrary depth, not hardcoded to 2 levels.
- Ideally it should use a tree payload like `get_category_tree`, not reconstruct parent/child relationships one node at a time in the UI.
- I want strong UX judgment, not just a mechanical rewrite.

Architectural preference:
- Best direction is probably a recursive accordion/tree view using the `get_category_tree` shape.
- I do NOT want a per-node lookup strategy using `Category.parent()` in the browser.
- I want a solution that respects the real data model and scales to deeper nesting.

Questions to consider:
- Should parent categories be expandable only, clickable only, or both?
- If both, how should trigger vs navigation be handled?
- Should the current URL/category auto-expand ancestor branches?
- Should the shop category browser behave more like navigation or more like a filter sidebar?

Please inspect the current files first, then propose the best implementation approach before changing code.



 */

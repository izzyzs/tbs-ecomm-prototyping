export type SuperCategoryKey =
    | "hair"
    | "wigs_extensions"
    | "beauty"
    | "skin_body"
    | "nails"
    | "men"
    | "kids"
    | "tools_accessories"
    | "shaving"
    | "eyewear"
    | "misc";

export type CategoryGroup = {
    key: SuperCategoryKey;
    label: string;
    patterns: (RegExp | string)[];
};

// Heuristic rules that map noisy POS inventory categories to cleaner super-categories.
export const CATEGORY_GROUP_RULES: CategoryGroup[] = [
    {
        key: "hair",
        label: "Hair Care",
        patterns: [
            /^hair\b/i,
            /scalp/i,
            /brush/i,
            /color/i,
            /relaxer/i,
            /treatment/i,
        ],
    },
    {
        key: "wigs_extensions",
        label: "Wigs & Extensions",
        patterns: [/wig/i, /weaving/i, /extension/i, /bundle/i, /frontal/i, /closure/i],
    },
    {
        key: "beauty",
        label: "Beauty & Makeup",
        patterns: [/makeup/i, /cosmetic/i, /beauty/i, /feminine/i],
    },
    {
        key: "skin_body",
        label: "Skin & Body",
        patterns: [/skin/i, /body/i, /foot/i, /lotion/i, /soap/i],
    },
    {
        key: "nails",
        label: "Nails",
        patterns: [/nail/i],
    },
    // Put Men before generic tools so men's accessories match here first
    {
        key: "men",
        label: "Men",
        patterns: [
            /\bmen\b|men's|mens/i,
            /beard/i,
            /wave/i,
            // Ensure Men's Head Accessories, durags, wave caps, etc. land here
            /men[^a-z]*.*(head|cap|accessor|durag|do[- ]?rag)/i,
        ],
    },
    {
        key: "kids",
        label: "Kids",
        patterns: [/kid/i, /child/i, /children/i, /boy/i, /girl/i],
    },
    {
        key: "tools_accessories",
        label: "Tools & Accessories",
        patterns: [/tool/i, /accessor/i, /comb/i, /cap/i, /bonnet/i],
    },
    {
        key: "shaving",
        label: "Shaving",
        patterns: [/razor/i, /shave/i],
    },
    {
        key: "eyewear",
        label: "Eyewear",
        patterns: [/eyewear/i, /sunglass/i, /glass/i],
    },
    {
        key: "misc",
        label: "Other",
        patterns: [/other/i, /misc/i, /product/i],
    },
];

export function matchSuperCategory(categoryName: string): CategoryGroup {
    for (const group of CATEGORY_GROUP_RULES) {
        for (const p of group.patterns) {
            if (typeof p === "string") {
                if (categoryName.toLowerCase().includes(p.toLowerCase())) return group;
            } else if (p.test(categoryName)) {
                return group;
            }
        }
    }
    return CATEGORY_GROUP_RULES[CATEGORY_GROUP_RULES.length - 1]; // misc
}

export function groupCategories(categories: string[]): Record<SuperCategoryKey, string[]> {
    const grouped = Object.fromEntries(CATEGORY_GROUP_RULES.map((g) => [g.key, [] as string[]])) as Record<SuperCategoryKey, string[]>;
    for (const name of categories) {
        const grp = matchSuperCategory(name);
        if (!grouped[grp.key].includes(name)) grouped[grp.key].push(name);
    }
    // Sort each group's categories alphabetically for consistency
    for (const key of Object.keys(grouped) as SuperCategoryKey[]) {
        grouped[key].sort((a, b) => a.localeCompare(b));
    }
    return grouped;
}

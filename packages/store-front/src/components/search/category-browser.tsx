import Link from "next/link";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { CategoryRow } from "@/utils/types";
import { Button } from "../my-button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";

type BrowserProps = {
    categories: CategoryRow[];
    activePath?: string;
};

export function ShopCategoryBrowser({ categories, activePath }: BrowserProps) {
    const [openPaths, setOpenPaths] = useState<Set<string>>(() => new Set(activePath ? getAncestorPaths(activePath) : []));

    function togglePath(path: string, open: boolean) {
        console.log(`togglePath called;\npath: ${path} open: ${open}`);
        setOpenPaths((prev) => {
            const next = new Set(prev);

            if (open) next.add(path);
            else next.delete(path);
            console.log(`prev`, prev);
            console.log(`next`, next);
            return next;
        });
    }

    return (
        <ul className="space-y-2">
            {categories.map((node, idx) => (
                <CategoryTreeNodeRow key={idx} node={node} depth={0} openPaths={openPaths} togglePath={togglePath} activePath={activePath} />
            ))}
        </ul>
    );
}

type RowProps = {
    node: CategoryRow;
    depth: number;
    openPaths: Set<string>;
    togglePath: (path: string, open: boolean) => void;
    activePath?: string;
};

function CategoryTreeNodeRow({ node, depth, openPaths, togglePath, activePath }: RowProps) {
    const hasChildren = node.children?.length > 0;

    const isActive = activePath === node.path;

    return (
        <Collapsible open={openPaths.has(node.path)} onOpenChange={(open) => togglePath(node.path, open)} className="flex w-[350px] flex-col gap-2">
            <li>
                <div>
                    {hasChildren ? (
                        <CollapsibleTrigger asChild>
                            <Button aria-label={openPaths.has(node.path) ? `Collapse ${node.name}` : `Expand ${node.name}`}>
                                <ChevronRight className={`size-4 transition-transform ${openPaths.has(node.path) ? "rotate-90" : ""}`} />
                                <span className="sr-only">toggle details</span>
                            </Button>
                        </CollapsibleTrigger>
                    ) : (
                        <span className="inline-block w-4" />
                    )}

                    <Link href={`/shop/${node.path}`} className={isActive ? "font-semibold text-pink-600" : ""}>
                        {node.name}
                    </Link>
                </div>

                {hasChildren && openPaths.has(node.path) ? (
                    <div>
                        <CollapsibleContent className="flex flex-col">
                            <ul>
                                {node.children.map((child) => (
                                    <CategoryTreeNodeRow key={child.path} node={child} depth={depth + 1} openPaths={openPaths} togglePath={togglePath} activePath={activePath} />
                                ))}
                            </ul>
                        </CollapsibleContent>
                    </div>
                ) : null}
            </li>
        </Collapsible>
    );
}

function getAncestorPaths(path: string) {
    const parts = path.split(".");
    return parts.slice(0, -1).map((_, i) => parts.slice(0, i + 1).join("."));
}

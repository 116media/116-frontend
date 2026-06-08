import { Tag } from "@/shared/presentation/components/ui/Tag";

/**
 * @interface MegaMenuTagItem
 *
 * @property {string} id - Unique identifier
 * @property {string} name - Display name of the tag
 */
export interface MegaMenuTagItem {
    id: string;
    name: string;
}

/**
 * @interface MegaMenuShellProps
 *
 * @property {string} tagsBasePath - Base path used to build tag filter URLs
 * @property {MegaMenuTagItem[]} popularTags - Popular tags rendered in the right column
 * @property {React.ReactNode} children - Column slots: MegaMenuShell.Categories + MegaMenuShell.Cards
 */
export interface MegaMenuShellProps {
    tagsBasePath: string;
    popularTags: MegaMenuTagItem[];
    children: React.ReactNode;
}

/**
 * MegaMenuShell
 *
 * @description
 * Root compound component providing the shared 3-column mega menu layout.
 * Owns the outer wrapper, grid, and right-column tags.
 * Use the named sub-components as slots:
 * - MegaMenuShell.Categories — left column
 * - MegaMenuShell.Cards — centre column
 */
export function MegaMenuShell({ tagsBasePath, popularTags, children }: MegaMenuShellProps) {
    return (
        <div className="w-full py-4">
            <div className="mx-auto grid max-w-7xl grid-cols-[3fr_5fr_3fr] gap-0 px-4 sm:px-6 lg:px-8 xl:px-10">
                {children}

                {popularTags.length > 0 && (
                    <div className="pl-4 p-3 flex flex-col gap-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Tags populaires
                        </p>
                        <div className="mb-1 h-px bg-border/60" />
                        <div className="flex flex-wrap gap-1.5">
                            {popularTags.slice(0, 16).map((tag) => (
                                <Tag
                                    key={tag.id}
                                    href={`${tagsBasePath}?tagId=${tag.id}`}
                                    variant="default"
                                    size="lg"
                                    shape="pill"
                                    prefix="#"
                                >
                                    {tag.name}
                                </Tag>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

import { MegaMenuShell as MegaMenuShellRoot } from "./MegaMenuShell";
import { MegaMenuShellCards } from "./MegaMenuShell.Cards";
import { MegaMenuShellCategories } from "./MegaMenuShell.Categories";

export type { MegaMenuShellProps, MegaMenuTagItem } from "./MegaMenuShell";
export type { MegaMenuShellCardsProps } from "./MegaMenuShell.Cards";
export type { MegaMenuShellCategoriesProps } from "./MegaMenuShell.Categories";

/**
 * MegaMenuShell
 *
 * @description
 * Shared chrome for both mega menus: the root lays the columns, `.Categories` the
 * category list and `.Cards` the featured column.
 */
export const MegaMenuShell = {
    Root: MegaMenuShellRoot,
    Cards: MegaMenuShellCards,
    Categories: MegaMenuShellCategories
} as const;

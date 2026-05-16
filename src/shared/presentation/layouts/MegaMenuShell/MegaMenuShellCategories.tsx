/**
 * @interface MegaMenuShellCategoriesProps
 *
 * @property {React.ReactNode} children - The category list component to render
 */
export interface MegaMenuShellCategoriesProps {
    children: React.ReactNode;
}

/**
 * MegaMenuShellCategories
 *
 * @description
 * Left column slot of MegaMenuShell.
 * Wraps the domain-specific category list component.
 */
export function MegaMenuShellCategories({ children }: MegaMenuShellCategoriesProps) {
    return <div className="pr-4 p-3">{children}</div>;
}

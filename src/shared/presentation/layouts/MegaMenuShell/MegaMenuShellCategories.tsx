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
    return <div className="pt-2 pr-3 pb-2 lg:pt-3 lg:pr-4 lg:pb-3">{children}</div>;
}

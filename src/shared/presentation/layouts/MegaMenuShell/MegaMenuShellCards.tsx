import Link from "next/link";

/**
 * @interface MegaMenuShellCardsProps
 *
 * @property {string} viewAllHref - URL for the "Voir tout →" link in the section header
 * @property {string} label - Label text for the "Voir tout" link
 * @property {React.ReactNode} children - Card grids to render inside the column
 */
export interface MegaMenuShellCardsProps {
    label: string;
    viewAllHref: string;
    children: React.ReactNode;
}

/**
 * MegaMenuShellCards
 *
 * @description
 * Centre column slot of MegaMenuShell.
 * Renders the "À la une" section header with a "Voir tout" link,
 * then the injected card grids below it.
 */
export function MegaMenuShellCards({ viewAllHref, label, children }: MegaMenuShellCardsProps) {
    return (
        <div className="flex flex-col gap-2 border-x border-border px-3 lg:gap-3 lg:px-4">
            <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    À la une
                </p>
                <Link
                    href={viewAllHref}
                    className="text-xs text-primary dark:text-secondary hover:underline"
                >
                    {label}
                </Link>
            </div>
            {children}
        </div>
    );
}

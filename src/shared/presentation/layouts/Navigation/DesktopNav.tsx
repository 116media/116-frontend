import { ChevronDown, Search } from "lucide-react";
import Link from "next/link";

import { Button } from "@/shared/presentation/components/ui/Button";
import { NAV_LINKS } from "@/shared/presentation/layouts/Header/constants";
import { cn } from "@/shared/presentation/utils/cn";

/**
 * DesktopNav
 *
 * @description
 * Centre section of the Header for desktop viewports.
 * Renders the primary nav links (Articles, Vidéos, Lyrics, Artistes) on the
 * left side and a search icon button on the right side, both grouped inside a
 * single centred container so the whole block sits in the middle of the header.
 *
 * Articles and Vidéos will receive mega menu panels in a later iteration.
 * The search button will open a full-screen search overlay when implemented.
 */
export function DesktopNav() {
    return (
        <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map(({ label, href, hasMegaMenu }) => (
                <Link
                    key={href}
                    href={href}
                    className={cn(
                        "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors",
                        "hover:bg-accent hover:text-accent-foreground"
                    )}
                >
                    {label}
                    {hasMegaMenu && (
                        <ChevronDown
                            size={14}
                            className="text-muted-foreground"
                        />
                    )}
                </Link>
            ))}

            <div
                className="ml-2 h-8 w-px bg-border"
                aria-hidden="true"
            />

            <Button
                size="icon"
                variant="ghost"
                aria-label="Rechercher"
                className="text-muted-foreground hover:text-foreground"
            >
                <Search />
            </Button>
        </div>
    );
}

"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/shared/presentation/components/ui/Button";
import { cn } from "@/shared/presentation/utils/cn";

import { SOCIAL_LINKS } from "./constants";

/**
 * TopBar
 *
 * @description
 * Gradient bar displayed above the main header on every public page.
 * Shows a "Nous suivre" label alongside social media icon links (YouTube,
 * Instagram, Facebook, TikTok, Twitter/X), all centered on one line.
 * Background is a left-to-right gradient from brand primary to brand secondary.
 * This is a Client Component so the follow label resolves through the active language.
 */
export function TopBar() {
    const { t } = useTranslation();

    return (
        <div className="w-full bg-linear-to-r from-brand-primary to-brand-secondary py-2 text-sm text-primary-foreground">
            <div className="flex items-center justify-center gap-1">
                <span className="mr-1 font-medium">{t("general.follow")}</span>

                {SOCIAL_LINKS.map(({ icon: Icon, href, label, hoverClass }) => (
                    <Button
                        asChild
                        size="icon"
                        key={label}
                        variant="outline"
                        className="group h-8 w-8 border-primary-foreground/60 bg-transparent hover:border-transparent hover:bg-primary-foreground/20 [&_svg]:size-3.5"
                    >
                        <a
                            href={href}
                            target="_blank"
                            aria-label={label}
                            rel="noopener noreferrer"
                            className={cn("text-primary-foreground", hoverClass)}
                        >
                            <Icon />
                        </a>
                    </Button>
                ))}
            </div>
        </div>
    );
}

"use client";

import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/presentation/components/ui/Button";
import { SOCIAL_LINKS } from "@/shared/presentation/constants/socials";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * How long each icon waits before taking its turn, so the invite travels along the row
 * instead of every icon moving at once.
 */
const RELAY_STAGGER_MS = 160;

/**
 * TopBar
 *
 * @description
 * Gradient bar above the main header on every public page, showing a follow label and
 * social icon links. The gradient drifts, and a halo relays across the icons once every
 * few seconds to invite a tap. Client Component so the label resolves through the
 * active language.
 */
export function TopBar() {
    const { t } = useTranslation();

    return (
        <div
            className={cn(
                "w-full bg-size-[200%_100%] bg-linear-to-r py-2 text-primary-foreground text-sm",
                "from-brand-primary via-brand-secondary to-brand-primary",
                "motion-safe:animate-topbar-gradient"
            )}
        >
            <div className="flex items-center justify-between gap-1 px-4 sm:justify-center sm:px-0">
                <span className="font-bold text-base sm:mr-1">{t("general.follow")}</span>

                <div className="flex items-center gap-1">
                    {SOCIAL_LINKS.map(({ icon: Icon, href, label, hoverClass }, index) => (
                        <Button
                            asChild
                            size="icon"
                            key={label}
                            variant="outline"
                            style={
                                {
                                    "--relay-delay": `${index * RELAY_STAGGER_MS}ms`
                                } as CSSProperties
                            }
                            className={cn(
                                "group relative h-8 w-8 border-primary-foreground/60 bg-transparent [&_svg]:size-3.5",
                                "hover:border-transparent hover:bg-primary-foreground/20",
                                "after:pointer-events-none after:absolute after:inset-0 after:rounded-base",
                                "after:border after:border-primary-foreground after:opacity-0 after:content-['']",
                                "motion-safe:animate-social-nudge motion-safe:[animation-delay:var(--relay-delay)]",
                                "motion-safe:after:animate-social-ping motion-safe:after:[animation-delay:var(--relay-delay)]",
                                "hover:animate-none hover:after:animate-none"
                            )}
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
        </div>
    );
}

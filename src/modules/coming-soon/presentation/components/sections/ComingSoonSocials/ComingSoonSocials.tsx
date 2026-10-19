"use client";

import { useTranslation } from "react-i18next";

import { Button } from "@/shared/presentation/components/ui/Button";
import { ShareIcon } from "@/shared/presentation/components/ui/Icon";
import { SectionHeader } from "@/shared/presentation/components/ui/SectionHeader";
import { SOCIAL_LINKS } from "@/shared/presentation/constants/socials";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for the ComingSoonSocials component.
 *
 * @interface ComingSoonSocialsProps
 * @property {string} title - The block's heading.
 * @property {string} subtitle - Why the reader should follow before the launch.
 */
export interface ComingSoonSocialsProps {
    title: string;
    subtitle: string;
}

/**
 * ComingSoonSocials
 *
 * @description
 * The networks to follow while a surface is still closed, one card per platform with
 * its handle and its own follow action. Reads the same ordered list the footer does, so
 * a channel is added in one place.
 */
export function ComingSoonSocials({ title, subtitle }: ComingSoonSocialsProps) {
    const { t } = useTranslation();

    return (
        <section className="flex flex-col gap-4">
            <SectionHeader
                size="base"
                icon={<ShareIcon />}
                title={title}
                subtitle={subtitle}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {SOCIAL_LINKS.map(({ icon: Icon, href, label, handle, colorClass }) => (
                    <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={t("comingSoon.launch.socials.followAria", { network: label })}
                        className="flex min-h-18 items-center gap-3 rounded-lg border border-foreground/5 bg-surface-raised p-4 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <span
                            className={cn(
                                "flex size-10 shrink-0 items-center justify-center rounded-md bg-muted",
                                colorClass
                            )}
                        >
                            <Icon className="size-5" />
                        </span>

                        <span className="flex min-w-0 flex-col">
                            <span className="truncate font-semibold text-foreground text-sm">
                                {label}
                            </span>
                            <span className="truncate text-muted-foreground text-xs">{handle}</span>
                        </span>

                        <Button
                            asChild
                            size="sm"
                            variant="brand-outline"
                            className="ml-auto shrink-0"
                        >
                            <span>{t("comingSoon.launch.socials.follow")}</span>
                        </Button>
                    </a>
                ))}
            </div>
        </section>
    );
}

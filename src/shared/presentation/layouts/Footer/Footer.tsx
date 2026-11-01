"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { APP_NAME } from "@/shared/infrastructure/constants/common";
import { Button } from "@/shared/presentation/components/ui/Button";
import { Logo } from "@/shared/presentation/components/ui/Logo";
import { SOCIAL_LINKS } from "@/shared/presentation/constants/socials";
import { FOOTER_COLUMNS } from "@/shared/presentation/layouts/Footer/constants";
import { PageContainer } from "@/shared/presentation/layouts/PageContainer";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for the Footer component.
 *
 * @interface FooterProps
 * @property {boolean} [minimal] - Drop the brand block and the navigation columns, leaving
 * the band and its copyright row. For a surface that stands in for the site rather than
 * sitting inside it, where the columns would link away from the only page there is.
 */
export interface FooterProps {
    minimal?: boolean;
}

/**
 * Footer
 *
 * @description
 * Site footer on every public and private page: brand block with tagline and social
 * links, three columns of navigation, and a bottom bar carrying the copyright.
 */
export function Footer({ minimal = false }: FooterProps) {
    const { t } = useTranslation();
    const year = new Date().getFullYear();

    return (
        <footer className="mt-16 w-full border-primary border-t-12 bg-muted dark:bg-black/50">
            <PageContainer>
                {!minimal && (
                    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-8 py-12 lg:py-16">
                        <div className="flex flex-col items-start gap-5">
                            <Logo
                                canRedirect
                                className="size-14"
                            />

                            <p className="max-w-sm text-pretty text-muted-foreground text-sm leading-relaxed">
                                {t("footer.tagline")}
                            </p>

                            <div className="flex items-center gap-2">
                                {SOCIAL_LINKS.map(({ icon: Icon, href, label, hoverClass }) => (
                                    <Button
                                        asChild
                                        size="icon"
                                        key={label}
                                        variant="ghost"
                                        className="size-10 rounded-lg bg-foreground/5 hover:bg-foreground/10 [&_svg]:size-4"
                                    >
                                        <a
                                            href={href}
                                            target="_blank"
                                            aria-label={label}
                                            rel="noopener noreferrer"
                                            className={cn("text-muted-foreground", hoverClass)}
                                        >
                                            <Icon />
                                        </a>
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {FOOTER_COLUMNS.map(({ heading, links }) => (
                            <nav
                                key={heading}
                                aria-label={t(heading)}
                                className="flex flex-col gap-4"
                            >
                                <h2 className="font-bold text-foreground text-sm uppercase tracking-widest">
                                    {t(heading)}
                                </h2>

                                <ul className="flex flex-col gap-3">
                                    {links.map(({ label, href }) => (
                                        <li key={href}>
                                            <Link
                                                href={href}
                                                className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                                            >
                                                {t(label)}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        ))}
                    </div>
                )}

                <div
                    className={cn(
                        "flex flex-wrap items-center justify-between gap-2 py-6 text-muted-foreground text-xs",
                        !minimal && "border-outlined border-t pt-6"
                    )}
                >
                    <p>{t("footer.copyright", { year, appName: APP_NAME })}</p>
                </div>
            </PageContainer>
        </footer>
    );
}

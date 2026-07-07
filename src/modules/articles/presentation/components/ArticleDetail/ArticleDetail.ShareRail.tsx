"use client";

import { SiFacebook, SiWhatsapp, SiX } from "@icons-pack/react-simple-icons";
import type { CSSProperties, ReactNode } from "react";
import { useTranslation } from "react-i18next";

import container from "@/shared/infrastructure/service.locator";
import { Button } from "@/shared/presentation/components/ui/Button";
import { ButtonGroup } from "@/shared/presentation/components/ui/ButtonGroup";
import { LinkIcon } from "@/shared/presentation/components/ui/Icon";
import { Colors } from "@/shared/presentation/constants/colors";
import { cn } from "@/shared/presentation/utils/cn";
import { showNotification } from "@/shared/presentation/utils/notification";
import { buildShareUrl, type SharePlatform } from "@/shared/presentation/utils/shareUrl";

import { shareLinkCopiedNotification } from "../../notifications/share.notification";

/**
 * Props for ArticleDetail.ShareRail.
 *
 * @interface ArticleDetailShareRailProps
 * @property {string} articleId - The article the backend share event is recorded against.
 * @property {string} slug - The article slug, used to build the URL outside the browser.
 * @property {string} title - The article title, carried into the share message.
 */
export interface ArticleDetailShareRailProps {
    slug: string;
    title: string;
    articleId: string;
}

/**
 * One button in the share rail. Each button carries a solid background — a network's brand
 * color (via `brand`) or a token background (via `bgClass`) — with a white glyph.
 *
 * @interface IShareRailButton
 * @property {string} key - Stable list key.
 * @property {ReactNode} icon - The brand / action glyph.
 * @property {string} label - Accessible label (`aria-label`).
 * @property {() => void} onClick - The share or copy action.
 * @property {string} [brand] - Solid brand background color, applied inline (network buttons).
 * @property {string} [bgClass] - Token background utilities, e.g. primary/secondary (copy button).
 */
interface IShareRailButton {
    key: string;
    icon: ReactNode;
    label: string;
    onClick: () => void;
    brand?: string;
    bgClass?: string;
}

/**
 * resolveArticleUrl
 *
 * @description
 * Resolves the absolute article URL. Prefers `window.location.href` in the browser; falls
 * back to the public site base plus the article path so the value is defined outside the
 * browser.
 *
 * @param slug - The article slug, used for the fallback path.
 * @returns The absolute article URL.
 */
function resolveArticleUrl(slug: string): string {
    if (typeof window !== "undefined") return window.location.href;
    return `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/articles/${slug}`;
}

/**
 * recordShare
 *
 * @description
 * Records the share against the article, fire-and-forget. The platform label is
 * client-side context only — the backend stores a bare share event and never receives the
 * platform. The promise is intentionally not awaited and its failure is swallowed so
 * telemetry never blocks or breaks the share surface.
 *
 * @param articleId - The article the share is recorded against.
 * @param platform - The platform label for client-side context.
 */
function recordShare(articleId: string, platform: string): void {
    void container.cradle.shareArticleUseCase.execute(articleId, platform);
}

/**
 * ArticleDetail.ShareRail
 *
 * @description
 * The article's share affordance: Facebook, X, WhatsApp, and copy-link buttons — a vertical
 * sticky rail on wide screens and a horizontal row on mobile. Each network button carries
 * its brand color as a solid background with a white glyph; the copy-link button uses the
 * primary token (secondary in dark). Each network button prefers the native Web Share API
 * and falls back to opening the platform's intent URL in a new window; the copy-link button
 * writes the URL to the clipboard and shows a toast. Every action records the share against
 * the backend, fire-and-forget. The solid brand backgrounds are the one documented
 * brand-color exception; all other colors are tokens.
 *
 * @param articleId - The article the backend share event is recorded against.
 * @param slug - The article slug, used to build the URL outside the browser.
 * @param title - The article title, carried into the share message.
 */
export function ArticleDetailShareRail({ articleId, slug, title }: ArticleDetailShareRailProps) {
    const { t } = useTranslation();

    const shareTo = (platform: SharePlatform) => async () => {
        const url = resolveArticleUrl(slug);
        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share({ url, title });
            } catch {
                return;
            }
        } else {
            window.open(buildShareUrl(platform, url, title), "_blank", "noopener");
        }
        recordShare(articleId, platform);
    };

    const copyLink = async () => {
        const url = resolveArticleUrl(slug);
        await navigator.clipboard.writeText(url);
        showNotification(shareLinkCopiedNotification(t));
        recordShare(articleId, "clipboard");
    };

    const SHARE_BUTTONS: IShareRailButton[] = [
        {
            key: "facebook",
            icon: <SiFacebook />,
            onClick: shareTo("facebook"),
            label: t("articles.share.facebook"),
            brand: Colors.Facebook
        },
        {
            key: "x",
            icon: <SiX />,
            onClick: shareTo("x"),
            label: t("articles.share.x"),
            brand: Colors.Twitter
        },
        {
            key: "whatsapp",
            icon: <SiWhatsapp />,
            onClick: shareTo("whatsapp"),
            label: t("articles.share.whatsapp"),
            brand: Colors.Whatsapp
        },
        {
            key: "copy",
            icon: <LinkIcon />,
            onClick: copyLink,
            label: t("articles.share.copy"),
            bgClass: "bg-accent text-accent-foreground hover:text-accent-foreground"
        }
    ];

    return (
        <ButtonGroup
            orientation="vertical"
            className="lg:sticky lg:top-32"
        >
            {SHARE_BUTTONS.map(({ key, icon, label, onClick, brand, bgClass }) => (
                <Button
                    key={key}
                    size="lg"
                    variant="ghost"
                    onClick={onClick}
                    aria-label={label}
                    style={brand ? ({ backgroundColor: brand } as CSSProperties) : undefined}
                    className={cn(
                        "size-12 p-0 text-white transition-all hover:text-white [&_svg]:size-5",
                        "hover:brightness-90 hover:[&_svg]:scale-120 [&_svg]:transition-transform",
                        bgClass
                    )}
                >
                    {icon}
                </Button>
            ))}
        </ButtonGroup>
    );
}

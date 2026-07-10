"use client";

import { useTranslation } from "react-i18next";

import container from "@/shared/infrastructure/service.locator";
import { SocialShareGroup } from "@/shared/presentation/components/common/SocialShareGroup";
import { showNotification } from "@/shared/presentation/utils/notification";

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
 * ArticleDetail.ShareRail
 *
 * @description
 * The article's share affordance: the shared {@link SocialShareGroup}
 * (Facebook, X, WhatsApp, copy-link) as a vertical sticky rail on wide
 * screens and a horizontal row on mobile. Every action records the share
 * against the backend, fire-and-forget — the platform label is client-side
 * context only and its failure is swallowed so telemetry never blocks or
 * breaks the share surface. The copy-link action additionally shows the
 * link-copied toast.
 *
 * @param articleId - The article the backend share event is recorded against.
 * @param slug - The article slug, used to build the URL outside the browser.
 * @param title - The article title, carried into the share message.
 */
export function ArticleDetailShareRail({ articleId, slug, title }: ArticleDetailShareRailProps) {
    const { t } = useTranslation();

    return (
        <SocialShareGroup
            title={title}
            orientation="vertical"
            url={resolveArticleUrl(slug)}
            className="lg:sticky lg:top-32"
            labels={{
                facebook: t("articles.share.facebook"),
                x: t("articles.share.x"),
                whatsapp: t("articles.share.whatsapp"),
                copy: t("articles.share.copy")
            }}
            onCopied={() => showNotification(shareLinkCopiedNotification(t))}
            onShared={(platform) => {
                void container.cradle.shareArticleUseCase.execute(articleId, platform);
            }}
        />
    );
}

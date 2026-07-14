"use client";

import { useTranslation } from "react-i18next";
import { ArticleShareNotification } from "@/modules/articles/presentation/utils/notification/articles.share.notification";
import container from "@/shared/infrastructure/service.locator";
import { SocialShareGroup } from "@/shared/presentation/components/common/SocialShareGroup";
import { showNotification } from "@/shared/presentation/utils/notification/notification.utils";
import { resolveShareUrl } from "@/shared/presentation/utils/share/share.utils";

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
 * ArticleDetail.ShareRail
 *
 * @description
 * Share rail built on the shared {@link SocialShareGroup}. Every action records the share
 * against the backend fire-and-forget, so telemetry failures never block the share
 * surface; copy-link additionally shows the link-copied toast.
 */
export function ArticleDetailShareRail({ articleId, slug, title }: ArticleDetailShareRailProps) {
    const { t } = useTranslation();

    return (
        <SocialShareGroup
            title={title}
            orientation="vertical"
            className="lg:sticky lg:top-32"
            url={resolveShareUrl(`/articles/${slug}`)}
            labels={{
                x: t("articles.share.x"),
                facebook: t("articles.share.facebook"),
                whatsapp: t("articles.share.whatsapp"),
                copy: t("articles.share.copy")
            }}
            onCopied={() => showNotification(ArticleShareNotification.linkCopied(t))}
            onShared={(shareChannel) => {
                void container.cradle.shareArticleUseCase.execute({ articleId, shareChannel });
            }}
        />
    );
}

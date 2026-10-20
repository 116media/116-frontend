"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { Sheet } from "@/shared/presentation/components/ui/Sheet";
import { ARTICLE_DETAIL_PATH } from "@/shared/presentation/constants/paths";

/**
 * Props for MyArticleCommentsModal.Header.
 *
 * @interface MyArticleCommentsModalHeaderProps
 * @property {string} articleSlug - The article the drawer belongs to, for the read link.
 */
export interface MyArticleCommentsModalHeaderProps {
    articleSlug: string;
}

/**
 * MyArticleCommentsModal.Header
 *
 * @description
 * The drawer's fixed top region: its title and subtitle, plus the link out to the article
 * the comments belong to. Carries the dialog's accessible name.
 *
 * @param articleSlug - The article the drawer belongs to.
 */
export function MyArticleCommentsModalHeader({ articleSlug }: MyArticleCommentsModalHeaderProps) {
    const { t } = useTranslation();

    return (
        <Sheet.Header
            showCloseButton={false}
            title={t("favorites.comments.drawerTitle")}
            description={t("favorites.comments.drawerSubtitle")}
        >
            <Link
                href={ARTICLE_DETAIL_PATH.replace(":slug", articleSlug)}
                className="font-medium text-primary text-sm hover:underline dark:text-secondary"
            >
                {t("favorites.comments.viewArticle")}
            </Link>
        </Sheet.Header>
    );
}

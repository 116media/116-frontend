"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { DialogTitle } from "@/shared/presentation/components/ui/Dialog";
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
        <div className="flex flex-col gap-1 border-surface-hover/50 border-b p-6 pr-12">
            <DialogTitle className="font-bold text-foreground text-lg">
                {t("favorites.comments.drawerTitle")}
            </DialogTitle>
            <p className="text-muted-foreground text-sm">
                {t("favorites.comments.drawerSubtitle")}
            </p>
            <Link
                href={ARTICLE_DETAIL_PATH.replace(":slug", articleSlug)}
                className="mt-1 font-medium text-primary text-sm hover:underline dark:text-secondary"
            >
                {t("favorites.comments.viewArticle")}
            </Link>
        </div>
    );
}

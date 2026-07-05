"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/presentation/components/ui/Button";
import { NewspaperIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Props for ArticleCardMedia.
 *
 * @interface ArticleCardMediaProps
 * @property {string} slug - The article slug (target of the "Read Article" link).
 * @property {string} title - The article title (image alt text).
 * @property {string | null} coverImageUrl - The cover image URL, or null to render a fallback.
 */
export interface ArticleCardMediaProps {
    slug: string;
    title: string;
    coverImageUrl: string | null;
}

/**
 * ArticleCardMedia
 *
 * @description
 * The 16:9 cover image with a hover overlay revealing a "Read Article" button and a
 * gentle image zoom. When the article has no cover, a token-colored fallback (muted
 * surface + icon) is rendered instead of an image, so no placeholder asset is needed.
 * The source design's category badge overlay is omitted.
 *
 * @param slug - The article slug (link target).
 * @param title - The article title (image alt).
 * @param coverImageUrl - The cover image URL, or null for the fallback.
 */
export function ArticleCardMedia({ slug, title, coverImageUrl }: ArticleCardMediaProps) {
    const { t } = useTranslation();
    return (
        <div className="relative aspect-video overflow-hidden">
            {coverImageUrl ? (
                <Image
                    fill
                    src={coverImageUrl}
                    alt={title}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            ) : (
                <div className="flex size-full items-center justify-center bg-muted">
                    <NewspaperIcon className="size-10 text-muted-foreground" />
                </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                    asChild
                    className="rounded-full bg-background/90 text-foreground hover:bg-background"
                >
                    <Link href={`/articles/${slug}`}>{t("articles.card.read")}</Link>
                </Button>
            </div>
        </div>
    );
}

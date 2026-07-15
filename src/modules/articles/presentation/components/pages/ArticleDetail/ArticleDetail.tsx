"use client";

import { type RefObject, useEffect, useRef } from "react";

import type { IArticleDetailEntity } from "@/modules/articles/domain/entities/IArticleDetailEntity";
import { CommentList } from "@/modules/articles/presentation/components/comments/CommentList";
import { ArticleDetailBody } from "@/modules/articles/presentation/components/sections/ArticleDetailBody";
import { ArticleDetailEngagement } from "@/modules/articles/presentation/components/sections/ArticleDetailEngagement";
import { ArticleDetailHero } from "@/modules/articles/presentation/components/sections/ArticleDetailHero";
import { ArticleDetailMetaBar } from "@/modules/articles/presentation/components/sections/ArticleDetailMetaBar";
import { ArticleDetailReadingProgress } from "@/modules/articles/presentation/components/sections/ArticleDetailReadingProgress";
import { ArticleDetailShareRail } from "@/modules/articles/presentation/components/sections/ArticleDetailShareRail";
import { ArticleDetailTags } from "@/modules/articles/presentation/components/sections/ArticleDetailTags";
import { ArticlesPopularSidebar } from "@/modules/articles/presentation/components/sections/ArticlesPopularSidebar";

/**
 * Props for the ArticleDetail assembler.
 *
 * @interface ArticleDetailProps
 * @property {IArticleDetailEntity} article - The fully resolved article to render.
 */
export interface ArticleDetailProps {
    article: IArticleDetailEntity;
}

/**
 * focusComposer
 *
 * @description
 * Scrolls the comments section into view and focuses the composer textarea, using
 * `preventScroll` so the focus does not compete with the smooth scroll. When the composer
 * is not mounted (guest view), only the section scroll runs.
 *
 * @param sectionRef - The comments section ref held by the assembler.
 * @param composerRef - The composer textarea ref held by the assembler.
 */
function focusComposer(
    sectionRef: RefObject<HTMLElement | null>,
    composerRef: RefObject<HTMLTextAreaElement | null>
): void {
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    composerRef.current?.focus({ preventScroll: true });
}

/**
 * ArticleDetail
 *
 * @description
 * Presentation assembler for the single-article page. The only component that receives the
 * whole entity; each section child gets only the fields it renders. Wires the shared
 * body/comments/composer refs and auto-scrolls to comments when `?comments=1` is present.
 */
export function ArticleDetail({ article }: ArticleDetailProps) {
    const bodyRef = useRef<HTMLDivElement>(null);
    const commentsRef = useRef<HTMLElement>(null);
    const composerRef = useRef<HTMLTextAreaElement>(null);

    const scrollToComments = () => focusComposer(commentsRef, composerRef);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("comments") === "1") focusComposer(commentsRef, composerRef);
    }, []);

    return (
        <div className="relative flex flex-col gap-8">
            <ArticleDetailReadingProgress bodyRef={bodyRef} />

            <div className="lg:grid lg:grid-cols-[auto_minmax(0,2.5fr)_minmax(0,2fr)] lg:gap-4">
                <aside>
                    <ArticleDetailShareRail
                        slug={article.slug}
                        articleId={article.id}
                        title={article.title}
                    />
                </aside>

                <article className="mt-6 flex min-w-0 flex-col gap-4 lg:mt-0">
                    <ArticleDetailHero
                        title={article.title}
                        categoryName={article.categoryName}
                        coverImageUrl={article.coverImageUrl}
                    />
                    <ArticleDetailEngagement
                        slug={article.slug}
                        title={article.title}
                        articleId={article.id}
                        isLiked={article.isLiked}
                        likeCount={article.likeCount}
                        author={article.author ?? undefined}
                        commentCount={article.commentCount}
                        shareCount={article.shareCount}
                        onComment={scrollToComments}
                    />
                    <p className="border-primary border-l-6 pl-3 font-article text-md text-muted-foreground italic leading-relaxed dark:border-secondary">
                        {article.headline}
                    </p>
                    <ArticleDetailMetaBar
                        articleId={article.id}
                        publishedAt={article.publishedAt}
                        isBookmarked={article.isBookmarked}
                        bookmarkCount={article.bookmarkCount}
                        readTimeInMinutes={article.readTimeInMinutes}
                    />
                    <ArticleDetailBody
                        bodyRef={bodyRef}
                        body={article.body}
                    />
                    <ArticleDetailTags tags={article.tags} />
                    <CommentList
                        ref={commentsRef}
                        slug={article.slug}
                        articleId={article.id}
                        composerRef={composerRef}
                        commentCount={article.commentCount}
                    />
                </article>

                <aside className="mt-12 lg:mt-0">
                    <ArticlesPopularSidebar currentArticleId={article.id} />
                </aside>
            </div>
        </div>
    );
}

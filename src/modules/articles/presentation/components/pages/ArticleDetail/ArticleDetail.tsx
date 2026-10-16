"use client";

import { type RefObject, useEffect, useRef } from "react";

import type { IArticleDetailEntity } from "@/modules/articles/domain/entities/IArticleDetailEntity";
import { CommentList } from "@/modules/articles/presentation/components/comments/CommentList";
import { ArticleDetailBody } from "@/modules/articles/presentation/components/sections/ArticleDetailBody";
import { ArticleDetailDock } from "@/modules/articles/presentation/components/sections/ArticleDetailDock";
import { ArticleDetailEngagement } from "@/modules/articles/presentation/components/sections/ArticleDetailEngagement";
import { ArticleDetailHero } from "@/modules/articles/presentation/components/sections/ArticleDetailHero";
import { ArticleDetailHeroCover } from "@/modules/articles/presentation/components/sections/ArticleDetailHeroCover";
import { ArticleDetailMetaBar } from "@/modules/articles/presentation/components/sections/ArticleDetailMetaBar";
import { ArticleDetailReadingProgress } from "@/modules/articles/presentation/components/sections/ArticleDetailReadingProgress";
import { ArticleDetailShareRail } from "@/modules/articles/presentation/components/sections/ArticleDetailShareRail";
import { ArticleDetailTags } from "@/modules/articles/presentation/components/sections/ArticleDetailTags";
import { ArticlesPopularSidebar } from "@/modules/articles/presentation/components/sections/ArticlesPopularSidebar";
import { NewsletterCard } from "@/modules/newsletter/presentation/components/cards/NewsletterCard";

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
 * body/comments/composer refs, feeds the mobile dock its reveal line, and auto-scrolls to
 * comments when `?comments=1` is present.
 */
export function ArticleDetail({ article }: ArticleDetailProps) {
    const bodyRef = useRef<HTMLDivElement>(null);
    const engagementRef = useRef<HTMLDivElement>(null);
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

            <div className="md:grid md:grid-cols-[auto_minmax(0,1fr)] md:gap-6 xl:grid-cols-[auto_minmax(0,2.5fr)_minmax(0,2fr)]">
                <aside className="hidden md:block">
                    <ArticleDetailShareRail
                        slug={article.slug}
                        articleId={article.id}
                        title={article.title}
                    />
                </aside>

                <article className="mt-6 flex w-full min-w-0 max-w-[68ch] flex-col gap-4 md:mt-0 xl:max-w-none">
                    <ArticleDetailHero
                        title={article.title}
                        categoryId={article.categoryId}
                        categoryName={article.categoryName}
                    />
                    <div ref={engagementRef}>
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
                    </div>
                    <ArticleDetailHeroCover
                        title={article.title}
                        coverImageUrl={article.coverImageUrl}
                    />
                    <p className="font-article text-lg text-muted-foreground leading-relaxed">
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

                <aside className="mt-12 flex w-full max-w-[68ch] flex-col gap-6 md:col-start-2 xl:col-start-3 xl:mt-0 xl:max-w-none">
                    <ArticlesPopularSidebar currentArticleId={article.id} />
                    <NewsletterCard />
                </aside>
            </div>

            <ArticleDetailDock
                slug={article.slug}
                title={article.title}
                articleId={article.id}
                isLiked={article.isLiked}
                likeCount={article.likeCount}
                revealAfterRef={engagementRef}
                shareCount={article.shareCount}
                commentCount={article.commentCount}
                isBookmarked={article.isBookmarked}
                bookmarkCount={article.bookmarkCount}
            />
        </div>
    );
}

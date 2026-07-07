"use client";

import { type RefObject, useEffect, useRef } from "react";

import type { IArticleDetailEntity } from "@/modules/articles/domain/entities/IArticleDetailEntity";
import { ArticlesPopularSidebar } from "../ArticlesPopularSidebar";
import { ArticleDetailBody } from "./ArticleDetail.Body";
import { ArticleDetailComments } from "./ArticleDetail.Comments";
import { ArticleDetailEngagement } from "./ArticleDetail.Engagement";
import { ArticleDetailHero } from "./ArticleDetail.Hero";
import { ArticleDetailMetaBar } from "./ArticleDetail.MetaBar";
import { ArticleDetailReadingProgress } from "./ArticleDetail.ReadingProgress";
import { ArticleDetailShareRail } from "./ArticleDetail.ShareRail";
import { ArticleDetailTags } from "./ArticleDetail.Tags";

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
 * Smooth-scrolls the comments section into view and focuses the composer's textarea, so a
 * reader who taps the engagement row's comment button lands ready to type. `preventScroll`
 * on focus avoids a second competing jump after the smooth scroll. When the composer is
 * not mounted (a guest sees the login prompt instead), only the section scroll runs.
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
 * The presentation assembler for the single-article page. Holds the whole
 * `IArticleDetailEntity` and distributes scoped props to each sub-composer — reading
 * progress, share rail, hero, body, tags, engagement, comments, and the popular sidebar —
 * laying them out in the two-column reading shell (a sticky share rail on the left, the
 * reading column in the center, the popular sidebar on the right; all stacked on mobile).
 * This is the only component that receives the entire entity; every child takes only the
 * fields it renders. A shared `bodyRef` links the body to the reading-progress bar, and
 * the `commentsRef` / `composerRef` pair links the engagement comment button to the
 * comments section so the button scrolls the reader to the composer instead of
 * navigating. A `?comments=1` query auto-scrolls once on mount.
 *
 * @param article - The fully resolved article to render.
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
                    <ArticleDetailComments
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

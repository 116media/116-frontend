# Spec 08 — Interactions

Design ref: [../09-interactions.md](../09-interactions.md). Reuses `useToggleArticleLike` /
`useToggleArticleBookmark` and the `useRequireAuth` gate **unchanged** — no new hooks. The
only detail-page addition is the comment button's in-page scroll/focus.

---

## 1. `ArticleDetail.Engagement`

`src/modules/articles/presentation/components/ArticleDetail/ArticleDetail.Engagement.tsx`

Scoped props: the counts and the article id, plus an `onComment` callback the assembler
supplies (it owns the composer ref — see §2). The row never receives the whole entity.

```tsx
"use client";

import { useTranslation } from "react-i18next";

import { useToggleArticleBookmark } from "@/modules/articles/presentation/hooks/useToggleArticleBookmark";
import { useToggleArticleLike } from "@/modules/articles/presentation/hooks/useToggleArticleLike";
import { useRequireAuth } from "@/modules/auth/presentation/hooks/useRequireAuth";
import { Button } from "@/shared/presentation/components/ui/Button";
import {
    BookmarkPlusIcon,
    HeartIcon,
    MessageSquareIcon
} from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn";

/**
 * Props for ArticleDetail.Engagement.
 *
 * @interface ArticleDetailEngagementProps
 * @property {string} articleId - The article the like/bookmark mutations target.
 * @property {number} likeCount - Baseline like count for the optimistic toggle.
 * @property {number} commentCount - Comment count shown beside the comment button.
 * @property {number} bookmarkCount - Baseline bookmark count for the optimistic toggle.
 * @property {() => void} onComment - Scrolls to and focuses the on-page comment composer.
 */
export interface ArticleDetailEngagementProps {
    articleId: string;
    likeCount: number;
    commentCount: number;
    bookmarkCount: number;
    onComment: () => void;
}

/**
 * ArticleDetail.Engagement
 *
 * @description
 * The detail page's action row: like, comment, and bookmark with live counts. Like and
 * bookmark reuse the feed's optimistic toggle hooks and are gated behind `useRequireAuth`
 * (a guest tap opens the auth modal and resumes on success). The comment button does not
 * navigate — it invokes `onComment` to smooth-scroll to and focus the on-page comment
 * composer. Active states use theme tokens (`fill-destructive` liked, `fill-primary`
 * bookmarked). Share is handled by the share rail, not this row.
 *
 * @param articleId - The article the like/bookmark mutations target.
 * @param likeCount - Baseline like count.
 * @param commentCount - Comment count shown beside the comment button.
 * @param bookmarkCount - Baseline bookmark count.
 * @param onComment - Scrolls to and focuses the on-page comment composer.
 */
export function ArticleDetailEngagement({
    articleId,
    likeCount,
    commentCount,
    bookmarkCount,
    onComment
}: ArticleDetailEngagementProps) {
    const { t } = useTranslation();
    const requireAuth = useRequireAuth();
    const like = useToggleArticleLike(articleId, likeCount);
    const bookmark = useToggleArticleBookmark(articleId, bookmarkCount);

    return (
        <div className="flex items-center justify-between border-y py-3">
            <div className="flex items-center gap-3">
                <Button
                    size="sm"
                    variant="ghost"
                    aria-label={t("articles.detail.like")}
                    className="h-9 gap-1 px-2 text-muted-foreground"
                    onClick={() => requireAuth(like.toggle)}
                >
                    <HeartIcon
                        className={cn("size-5", like.liked && "fill-destructive text-destructive")}
                    />
                    <span className={cn(like.liked && "text-destructive")}>{like.count}</span>
                </Button>

                <Button
                    size="sm"
                    variant="ghost"
                    aria-label={t("articles.detail.comment")}
                    className="h-9 gap-1 px-2 text-muted-foreground"
                    onClick={onComment}
                >
                    <MessageSquareIcon className="size-5" />
                    <span>{commentCount}</span>
                </Button>
            </div>

            <Button
                size="icon"
                variant="outline"
                aria-label={t("articles.detail.bookmark")}
                className="size-9 text-muted-foreground"
                onClick={() => requireAuth(bookmark.toggle)}
            >
                <BookmarkPlusIcon
                    className={cn("size-5!", bookmark.bookmarked && "fill-primary text-primary")}
                />
            </Button>
        </div>
    );
}
```

---

## 2. Wiring `onComment` — the composer ref in the assembler

The comment button's scroll/focus target is the composer's textarea. The `ArticleDetail`
assembler owns a `RefObject`, threads it to the composer ([10-comments.md](10-comments.md)),
and passes a focus handler down to the engagement row. This keeps the engagement row free of
DOM queries and free of the entity.

```tsx
"use client";

import { useRef } from "react";

/**
 * focusComposer
 *
 * @description
 * Smooth-scrolls the comment composer into view and focuses its textarea, so a reader who
 * taps the engagement row's comment button lands ready to type. `preventScroll` on focus
 * avoids a second competing jump after the smooth scroll.
 *
 * @param ref - The composer textarea ref held by the ArticleDetail assembler.
 */
function focusComposer(ref: React.RefObject<HTMLTextAreaElement | null>): void {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    ref.current?.focus({ preventScroll: true });
}
```

Inside the assembler:

```tsx
const composerRef = useRef<HTMLTextAreaElement>(null);

<ArticleDetailEngagement
    articleId={article.id}
    likeCount={article.likeCount}
    commentCount={article.commentCount}
    bookmarkCount={article.bookmarkCount}
    onComment={() => focusComposer(composerRef)}
/>
```

The composer receives the same `composerRef` and forwards it to its `<Textarea ref={…} />`.
The comments section additionally carries `id="comments"` as a fallback anchor. See
[11-page-and-layout.md](11-page-and-layout.md) and
[10-comments.md](10-comments.md).

---

## 3. No per-user initial state

`useToggleArticleLike` / `useToggleArticleBookmark` start `on: false` because the
`ArticleDetailDto` exposes no `isLiked` / `isBookmarked`
([../03-backend-api-reference.md](../03-backend-api-reference.md) §1). This is unchanged from
the feed and is a known limitation, tracked in
[../19-open-questions.md](../19-open-questions.md).

---

## Tasks

- [ ] `ArticleDetail.Engagement` — like / comment / bookmark, scoped props (`articleId`, counts, `onComment`).
- [ ] Reuse `useToggleArticleLike(articleId, likeCount)` / `useToggleArticleBookmark(articleId, bookmarkCount)` verbatim.
- [ ] Auth-gate like and bookmark with `useRequireAuth` (same pattern as `ArticleCard.Engagement`).
- [ ] Comment button calls `onComment` (in-page scroll + focus) — no navigation, no drawer.
- [ ] Token active states: `fill-destructive` (liked), `fill-primary` (bookmarked); muted comment icon.
- [ ] Assembler owns `composerRef`; `focusComposer` smooth-scrolls + focuses; `id="comments"` fallback anchor.
- [ ] Live counts: `like.count`, `commentCount`, bookmark toggle; `aria-label` on every button.
- [ ] `tsc` + biome clean.

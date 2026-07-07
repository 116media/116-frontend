# Spec 10 — Comments

Design ref: [../12-comments.md](../12-comments.md), [../03-backend-api-reference.md](../03-backend-api-reference.md),
[../15-loading-empty-error.md](../15-loading-empty-error.md), [../19-open-questions.md](../19-open-questions.md).

Hooks (`useArticleComments`, `useAddArticleComment`) and query keys are specced in
[03-hooks-and-keys.md](03-hooks-and-keys.md); the domain `IArticleCommentEntity` /
`IArticleAuthor` in [01-domain-and-mappers.md](01-domain-and-mappers.md); i18n keys in
[12-i18n.md](12-i18n.md).

---

## 1. `Textarea` (shared primitive)

`src/shared/presentation/components/ui/Textarea/Textarea.tsx`. The multiline sibling of
`Input` — same tokens, same states, with an auto min-height. None exists today.

```tsx
"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";

import { cn } from "@/shared/presentation/utils/cn";

/**
 * Textarea
 *
 * @description
 * The base multiline text primitive — the textarea sibling of `Input`. Mirrors `Input`'s
 * tokens exactly: transparent surface (`dark:bg-input/30` in dark), `border-input`
 * border, `rounded-lg` corners, the shadcn focus ring (`ring-3 ring-ring/20` +
 * `border-ring`), and the disabled + `aria-invalid` states (light and dark). Adds a
 * comfortable auto min-height (`min-h-24`) and vertical-only resize. All theme tokens, so
 * light/dark is automatic; callers override sizing or radius via `className` (merged by
 * `cn`, so later utilities win).
 *
 * @param className - Extra classes merged onto (and overriding) the base styles.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
    ({ className, ...props }, ref) => (
        <textarea
            ref={ref}
            data-slot="textarea"
            className={cn(
                "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20",
                "min-h-24 w-full min-w-0 resize-y rounded-md border border-input bg-transparent px-3 py-2",
                "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
                "text-base outline-none transition-colors placeholder:text-muted-foreground md:text-sm",
                "disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
                "dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/20",
                className
            )}
            {...props}
        />
    )
);
Textarea.displayName = "Textarea";
```

`src/shared/presentation/components/ui/Textarea/index.ts`:

```ts
export { Textarea } from "./Textarea";
```

---

## 2. `ArticleDetailComment` (one row)

`src/modules/articles/presentation/components/ArticleDetail/ArticleDetailComment.tsx`.

Consumes only an `IArticleCommentEntity` (scoped — it never sees the whole article). The
author name/avatar come from the optional `author` projection; when absent, a neutral,
deterministic fallback is derived from `userId`. A deleted comment renders a muted
placeholder in place of the body.

```tsx
"use client";

import { useTranslation } from "react-i18next";

import type { IArticleCommentEntity } from "@/modules/articles/domain/entities/IArticleCommentEntity";
import { UserAvatar } from "@/shared/presentation/components/common/UserAvatar";
import { RelativeDate } from "@/shared/presentation/components/ui/RelativeDate";

/**
 * commentDisplayName
 *
 * @description
 * Resolves the name shown for a comment. Prefers the `author` projection's `userName`
 * (the target state once the backend adds it); otherwise derives a stable, neutral
 * reference from the `userId` (a short prefix), which also seeds `UserAvatar`'s
 * deterministic color and initials. Never renders a raw full Guid.
 *
 * @param comment - The comment whose author name is resolved.
 * @param fallback - The generic label for an unknown author (from i18n).
 * @returns The display name for the row.
 */
function commentDisplayName(comment: IArticleCommentEntity, fallback: string): string {
    if (comment.author?.userName) return comment.author.userName;
    return fallback;
}

/**
 * ArticleDetailComment
 *
 * @description
 * A single comment row: the author's avatar, display name, relative post date, and body.
 * The DTO carries only a `userId`, so the name and avatar come from the optional
 * `author` projection and fall back to a neutral, deterministic identity derived from the
 * `userId` when the projection is absent. A deleted comment (`isDeleted` / null body)
 * renders a muted "comment removed" placeholder while keeping the avatar and date so the
 * thread's shape is preserved.
 *
 * @param comment - The comment to render.
 */
export function ArticleDetailComment({ comment }: { comment: IArticleCommentEntity }) {
    const { t } = useTranslation();
    const displayName = commentDisplayName(comment, t("articles.comments.anonymousUser"));

    return (
        <div className="flex gap-3">
            <UserAvatar
                userName={displayName}
                image={comment.author?.avatarUrl ?? undefined}
                size={36}
            />
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground text-sm">{displayName}</span>
                    <span className="text-muted-foreground text-xs">
                        <RelativeDate date={comment.createdAt} />
                    </span>
                </div>
                {comment.isDeleted || comment.body === null ? (
                    <p className="text-muted-foreground text-sm italic">
                        {t("articles.comments.removed")}
                    </p>
                ) : (
                    <p className="whitespace-pre-wrap text-foreground text-sm">{comment.body}</p>
                )}
            </div>
        </div>
    );
}
```

---

## 3. `ArticleDetailCommentComposer`

`src/modules/articles/presentation/components/ArticleDetail/ArticleDetailCommentComposer.tsx`.

`Textarea` + submit, gated by `useRequireAuth` (the codebase pattern — same guard the feed
card uses for like/bookmark). Guests see a "log in to comment" prompt that opens the auth
modal at the login view; the resume-after-login hook re-runs the post. Posting is
optimistic via `useAddArticleComment`, which stamps the current user (`useAuth`) on the
optimistic row.

```tsx
"use client";

import { type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAddArticleComment } from "@/modules/articles/presentation/hooks/useAddArticleComment";
import { useAuth } from "@/modules/auth/presentation/context/AuthProvider";
import { useAuthModal } from "@/modules/auth/presentation/context/AuthModalProvider";
import { useRequireAuth } from "@/modules/auth/presentation/hooks/useRequireAuth";
import { Button } from "@/shared/presentation/components/ui/Button";
import { Textarea } from "@/shared/presentation/components/ui/Textarea";

/**
 * Maximum comment length accepted by the composer before submit is blocked.
 */
const MAX_COMMENT_LENGTH = 2000;

/**
 * Props for ArticleDetailCommentComposer.
 *
 * @interface ArticleDetailCommentComposerProps
 * @property {string} articleId - The article the comment is posted to and the mutation targets.
 */
export interface ArticleDetailCommentComposerProps {
    articleId: string;
}

/**
 * ArticleDetailCommentComposer
 *
 * @description
 * The comment composer: a `Textarea` and a submit `Button` wired to
 * {@link useAddArticleComment}, which optimistically prepends the new comment (stamped
 * with the current user from `useAuth`) and bumps the count. Auth-gated via
 * {@link useRequireAuth} — a guest sees a "log in to comment" prompt that opens the auth
 * modal at the login view, and the post resumes after a successful login. Validates a
 * non-empty (trimmed), length-bounded body, disables submit while pending, and clears the
 * field on success.
 *
 * @param articleId - The article the comment is posted to.
 */
export function ArticleDetailCommentComposer({ articleId }: ArticleDetailCommentComposerProps) {
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();
    const { open } = useAuthModal();
    const requireAuth = useRequireAuth();
    const addComment = useAddArticleComment(articleId);

    const [value, setValue] = useState("");

    const trimmed = value.trim();
    const isValid = trimmed.length > 0 && trimmed.length <= MAX_COMMENT_LENGTH;

    const submit = () => {
        if (!isValid) return;
        addComment.mutate(trimmed, { onSuccess: () => setValue("") });
    };

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        requireAuth(submit);
    };

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-start gap-3 rounded-lg border border-input bg-muted/40 p-4">
                <p className="text-muted-foreground text-sm">
                    {t("articles.comments.loginPrompt")}
                </p>
                <Button
                    variant="outline"
                    onClick={() => open("login")}
                >
                    {t("articles.comments.loginCta")}
                </Button>
            </div>
        );
    }

    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col gap-3"
        >
            <Textarea
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder={t("articles.comments.placeholder")}
                maxLength={MAX_COMMENT_LENGTH}
                disabled={addComment.isPending}
                aria-label={t("articles.comments.composerLabel")}
            />
            <div className="flex items-center justify-end">
                <Button
                    type="submit"
                    loading={addComment.isPending}
                    disabled={!isValid || addComment.isPending}
                >
                    {t("articles.comments.submit")}
                </Button>
            </div>
        </form>
    );
}
```

> `useRequireAuth` already reads `useAuth` + `useAuthModal` internally; the direct
> `useAuth`/`useAuthModal` here drive the guest **prompt** (a clearer affordance than a
> silent submit gate) and the optimistic author. The `requireAuth(submit)` wrapper is the
> safety net for the authenticated → expired-session edge.

---

## 4. `ArticleDetail.Comments` (the section)

`src/modules/articles/presentation/components/ArticleDetail/ArticleDetail.Comments.tsx`.

Heading + live count, composer at the top, the infinite list, a sentinel + "load more"
fallback, and the loading / empty / error states. Forwards a `ref` and carries a stable
`id` so the engagement comment button can scroll to it and focus the composer.

```tsx
"use client";

import { forwardRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useArticleComments } from "@/modules/articles/presentation/hooks/useArticleComments";
import { Button } from "@/shared/presentation/components/ui/Button";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { AlertCircleIcon, MessageSquareIcon } from "@/shared/presentation/components/ui/Icon";
import { useIntersectionObserver } from "@/shared/presentation/hooks/useIntersectionObserver";

import { ArticleDetailComment } from "./ArticleDetailComment";
import { ArticleDetailCommentComposer } from "./ArticleDetailCommentComposer";

/**
 * Stable IntersectionObserver options for the comments load-more sentinel. Pre-loads the
 * next page ~200px before the sentinel enters the viewport; module scope keeps the
 * identity stable so the observer is not recreated on re-render.
 */
const SENTINEL_OPTIONS: IntersectionObserverInit = { rootMargin: "200px 0px" };

/**
 * Props for ArticleDetailComments.
 *
 * @interface ArticleDetailCommentsProps
 * @property {string} articleId - The article whose comments are listed and posted to.
 * @property {number} commentCount - Baseline count for the section heading (kept live by the mutation).
 */
export interface ArticleDetailCommentsProps {
    articleId: string;
    commentCount: number;
}

/**
 * CommentSkeleton
 *
 * @description
 * A single comment-shaped shimmer block (avatar, name line, two body lines) matching the
 * row layout, so replacing skeletons with real comments causes no layout shift.
 */
function CommentSkeleton() {
    return (
        <div className="flex gap-3">
            <div className="size-9 shrink-0 animate-pulse rounded-full bg-muted" />
            <div className="flex w-full flex-col gap-2">
                <div className="h-3 w-1/4 animate-pulse rounded bg-muted" />
                <div className="h-3 w-full animate-pulse rounded bg-muted" />
                <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
            </div>
        </div>
    );
}

/**
 * ArticleDetailComments
 *
 * @description
 * The comments section: a heading with the live comment count, the composer at the top,
 * and the infinite comment list. Drives {@link useArticleComments} (infinite), flattens
 * its pages, and renders {@link ArticleDetailComment} rows with a sentinel observed by
 * {@link useIntersectionObserver} that requests the next page as it enters the viewport,
 * plus an explicit "load more" `Button` fallback. Shows loading skeletons, an
 * {@link EmptyState} ("be the first to comment") when there are none, and a retryable
 * error state. Forwards `ref` and carries the `comments` anchor `id` so the engagement
 * comment button can scroll to it and focus the composer.
 *
 * @param articleId - The article whose comments are listed and posted to.
 * @param commentCount - Baseline count for the heading.
 */
export const ArticleDetailComments = forwardRef<HTMLElement, ArticleDetailCommentsProps>(
    ({ articleId, commentCount }, ref) => {
        const { t } = useTranslation();
        const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
            useArticleComments(articleId);

        const [sentinelRef, isSentinelVisible] = useIntersectionObserver(SENTINEL_OPTIONS);

        const comments = data?.pages.flatMap((page) => page.items) ?? [];

        useEffect(() => {
            if (isSentinelVisible && hasNextPage && !isFetchingNextPage) fetchNextPage();
        }, [isSentinelVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

        const list = () => {
            if (isLoading) {
                return (
                    <div className="flex flex-col gap-6">
                        {Array.from({ length: 4 }, (_, i) => (
                            <CommentSkeleton key={i} />
                        ))}
                    </div>
                );
            }
            if (isError) {
                return (
                    <EmptyState
                        context="article-comments-error"
                        icon={<AlertCircleIcon className="size-10" />}
                        title={t("articles.comments.error.title")}
                        action={
                            <Button
                                variant="outline"
                                onClick={() => refetch()}
                            >
                                {t("articles.comments.error.retry")}
                            </Button>
                        }
                        className="min-h-0 py-12"
                    />
                );
            }
            if (comments.length === 0) {
                return (
                    <EmptyState
                        context="article-comments-empty"
                        icon={<MessageSquareIcon className="size-10" />}
                        title={t("articles.comments.empty.title")}
                        subtitle={t("articles.comments.empty.body")}
                        className="min-h-0 py-12"
                    />
                );
            }
            return (
                <div className="flex flex-col gap-6">
                    {comments.map((comment) => (
                        <ArticleDetailComment
                            key={comment.id}
                            comment={comment}
                        />
                    ))}
                    {isFetchingNextPage && <CommentSkeleton />}
                    {hasNextPage && (
                        <div
                            ref={sentinelRef}
                            className="flex justify-center"
                        >
                            <Button
                                variant="ghost"
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                            >
                                {t("articles.comments.loadMore")}
                            </Button>
                        </div>
                    )}
                </div>
            );
        };

        return (
            <section
                ref={ref}
                id="comments"
                className="flex scroll-mt-24 flex-col gap-6"
            >
                <h2 className="font-semibold text-foreground text-xl">
                    {t("articles.comments.title", { count: commentCount })}
                </h2>
                <ArticleDetailCommentComposer articleId={articleId} />
                {list()}
            </section>
        );
    }
);
ArticleDetailComments.displayName = "ArticleDetailComments";
```

> `scroll-mt-24` offsets the section under the sticky header when the engagement button
> scrolls it into view.

---

## Tasks

- [ ] `Textarea` primitive — mirrors `Input`'s tokens (`border-input`, focus ring,
      disabled/`aria-invalid`), auto min-height (`min-h-24`), vertical resize; barrel
      `index.ts`.
- [ ] `ArticleDetailComment` — avatar + name + `RelativeDate` + body; `author` projection
      with a neutral `userId`-derived fallback (deterministic `UserAvatar`); `isDeleted` /
      null-body renders the muted "comment removed" placeholder.
- [ ] `ArticleDetailCommentComposer` — `Textarea` + submit; `useAddArticleComment`
      (optimistic prepend + count bump, current user stamped); non-empty + max-length
      validation; disabled while pending; clears on success.
- [ ] Auth gating — guest sees the "log in to comment" prompt (`useAuthModal.open("login")`);
      submit wrapped in `useRequireAuth` (resume-after-login); no hardcoded copy.
- [ ] `ArticleDetail.Comments` — heading with `count`, composer at top, infinite list,
      sentinel + "load more" fallback (double-fetch guarded), skeleton / `EmptyState` /
      error+retry states; `id="comments"` + forwarded `ref` + `scroll-mt`.
- [ ] i18n keys added (`articles.comments.*` — title/count, placeholder, submit,
      loginPrompt, loginCta, anonymousUser, removed, empty, error, loadMore) in en/fr
      ([12-i18n.md](12-i18n.md)).
- [ ] `tsc` + biome clean; posting prepends + bumps the count; guest is bounced to login
      and the post resumes; deleted comment shows the placeholder.

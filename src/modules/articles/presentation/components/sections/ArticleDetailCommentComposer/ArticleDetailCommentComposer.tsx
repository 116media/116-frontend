"use client";

import { type FormEvent, type RefObject, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAddArticleComment } from "@/modules/articles/presentation/hooks/useAddArticleComment";
import { useAuthModal } from "@/modules/auth/presentation/context/AuthModalProvider";
import { useAuth } from "@/modules/auth/presentation/context/AuthProvider";
import { Button } from "@/shared/presentation/components/ui/Button";
import { Textarea } from "@/shared/presentation/components/ui/Textarea";

/**
 * Maximum comment length accepted by the composer before submit is blocked. Mirrors the
 * backend's comment body limit.
 */
const MAX_COMMENT_LENGTH = 1000;

/**
 * Props for ArticleDetailCommentComposer.
 *
 * @interface ArticleDetailCommentComposerProps
 * @property {string} articleId - The article the comment is posted to and the mutation targets.
 * @property {string} slug - The article slug, used to bump the cached detail comment count.
 * @property {RefObject<HTMLTextAreaElement | null>} [composerRef] - Ref forwarded to the
 * textarea so the engagement comment button can scroll to and focus it.
 */
export interface ArticleDetailCommentComposerProps {
    slug: string;
    articleId: string;
    composerRef?: RefObject<HTMLTextAreaElement | null>;
}

/**
 * ArticleDetailCommentComposer
 *
 * @description
 * Comment composer wired to {@link useAddArticleComment}. Validates a trimmed,
 * length-bounded body and clears the field on success; guests see a login prompt that
 * opens the auth modal instead of the form.
 */
export function ArticleDetailCommentComposer({
    articleId,
    slug,
    composerRef
}: ArticleDetailCommentComposerProps) {
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();
    const { open } = useAuthModal();
    const addComment = useAddArticleComment(articleId, slug);

    const [value, setValue] = useState("");

    const trimmed = value.trim();
    const isValid = trimmed.length > 0 && trimmed.length <= MAX_COMMENT_LENGTH;

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isValid) return;
        addComment.submit(trimmed, () => setValue(""));
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
                ref={composerRef}
                maxLength={MAX_COMMENT_LENGTH}
                disabled={addComment.isPending}
                onChange={(event) => setValue(event.target.value)}
                placeholder={t("articles.comments.placeholder")}
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

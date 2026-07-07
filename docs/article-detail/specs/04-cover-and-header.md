# Spec 04 — Cover & Header (Hero)

Design ref: [../05-cover-and-header.md](../05-cover-and-header.md). Tags block:
[../10-tags.md](../10-tags.md).

`ArticleDetail.Hero` and its sub-composers, plus `ArticleDetail.Tags`. Every sub-composer
receives a **scoped subset** of `IArticleDetailEntity` — only the `ArticleDetail` assembler
(page-and-layout spec) holds the whole entity. All snippets are JSDoc-only, theme tokens
only, icons from the barrel.

Folder: `src/modules/articles/presentation/components/ArticleDetail/`.

---

## 1. `ArticleDetail.Hero.tsx`

```tsx
import type { IArticleAuthor } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import { Tag } from "@/shared/presentation/components/ui/Tag";

import { ArticleDetailHeroCover } from "./ArticleDetailHeroCover";
import { ArticleDetailHeroMeta } from "./ArticleDetailHeroMeta";

/**
 * Props for the ArticleDetail.Hero component.
 *
 * @interface ArticleDetailHeroProps
 * @property {string | null} coverImageUrl - The cover image URL, or null for the fallback.
 * @property {string} categoryName - The article category display name.
 * @property {string} title - The article title.
 * @property {string} headline - The article headline (lead paragraph).
 * @property {IArticleAuthor} [author] - The author projection (userName + avatarUrl).
 * @property {string | null} publishedAt - ISO publication date, or null.
 * @property {number} readTimeInMinutes - Estimated reading time in minutes.
 */
export interface ArticleDetailHeroProps {
    coverImageUrl: string | null;
    categoryName: string;
    title: string;
    headline: string;
    author?: IArticleAuthor;
    publishedAt: string | null;
    readTimeInMinutes: number;
}

/**
 * ArticleDetail.Hero
 *
 * @description
 * The article header. Renders the full-bleed cover band (with the category chip and author
 * overlaid on the gradient scrim), then a text block of the category Tag (exclusive-tags
 * style, no hashtag prefix), the title, the headline, and the meta line. Receives a scoped
 * subset of the article entity and hands each child exactly the fields it renders.
 *
 * @param coverImageUrl - The cover image URL, or null for the fallback.
 * @param categoryName - The category display name.
 * @param title - The article title.
 * @param headline - The article headline.
 * @param author - The author projection, if resolved.
 * @param publishedAt - ISO publication date, or null.
 * @param readTimeInMinutes - Estimated reading time in minutes.
 */
export function ArticleDetailHero({
    coverImageUrl,
    categoryName,
    title,
    headline,
    author,
    publishedAt,
    readTimeInMinutes
}: ArticleDetailHeroProps) {
    return (
        <header className="flex flex-col gap-6">
            <ArticleDetailHeroCover
                coverImageUrl={coverImageUrl}
                categoryName={categoryName}
                author={author}
            />
            <div className="flex flex-col gap-4">
                <Tag as="span" variant="primary" size="sm" className="self-start">
                    {categoryName}
                </Tag>
                <h1 className="font-bold text-3xl tracking-tight md:text-5xl">{title}</h1>
                <p className="text-lg text-muted-foreground">{headline}</p>
                <ArticleDetailHeroMeta
                    publishedAt={publishedAt}
                    readTimeInMinutes={readTimeInMinutes}
                />
            </div>
        </header>
    );
}
```

---

## 2. `ArticleDetailHeroCover.tsx`

```tsx
import Image from "next/image";

import type { IArticleAuthor } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import { UserAvatar } from "@/shared/presentation/components/common/UserAvatar";
import { NewspaperIcon } from "@/shared/presentation/components/ui/Icon";
import { Tag } from "@/shared/presentation/components/ui/Tag";

/**
 * Props for ArticleDetailHeroCover.
 *
 * @interface ArticleDetailHeroCoverProps
 * @property {string | null} coverImageUrl - The cover image URL, or null for the fallback.
 * @property {string} categoryName - The category display name (chip + image alt).
 * @property {IArticleAuthor} [author] - The author projection (userName + avatarUrl).
 */
export interface ArticleDetailHeroCoverProps {
    coverImageUrl: string | null;
    categoryName: string;
    author?: IArticleAuthor;
}

/**
 * ArticleDetailHeroCover
 *
 * @description
 * The full-bleed cover band. Renders the cover image (next/image, fill, priority,
 * object-cover) under a gradient scrim, with the category chip overlaid at the bottom-left
 * and the author (avatar + name) at the bottom-right. When there is no cover, a
 * token-colored muted surface with a NewspaperIcon stands in — no placeholder asset. The
 * author byline uses white text because it sits on the fixed dark scrim, not a theme
 * surface.
 *
 * @param coverImageUrl - The cover image URL, or null for the fallback.
 * @param categoryName - The category display name (chip label and image alt).
 * @param author - The author projection, if resolved.
 */
export function ArticleDetailHeroCover({
    coverImageUrl,
    categoryName,
    author
}: ArticleDetailHeroCoverProps) {
    return (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl md:aspect-auto md:h-[60vh]">
            {coverImageUrl ? (
                <Image
                    fill
                    priority
                    src={coverImageUrl}
                    alt={categoryName}
                    sizes="100vw"
                    className="object-cover"
                />
            ) : (
                <div className="flex size-full items-center justify-center bg-muted">
                    <NewspaperIcon className="size-16 text-muted-foreground" />
                </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
            <span className="absolute bottom-4 left-4">
                <Tag as="span" variant="primary" size="sm">
                    {categoryName}
                </Tag>
            </span>
            <div className="absolute right-4 bottom-4 flex items-center gap-2 text-white">
                <UserAvatar
                    size={32}
                    userName={author?.userName ?? ""}
                    image={author?.avatarUrl ?? undefined}
                />
                <span className="font-medium text-sm">{author?.userName}</span>
            </div>
        </div>
    );
}
```

---

## 3. `ArticleDetailHeroMeta.tsx`

```tsx
import { useTranslation } from "react-i18next";

import { ClockIcon } from "@/shared/presentation/components/ui/Icon";
import { RelativeDate } from "@/shared/presentation/components/ui/RelativeDate";
import { Separator } from "@/shared/presentation/components/ui/Separator";

/**
 * Props for ArticleDetailHeroMeta.
 *
 * @interface ArticleDetailHeroMetaProps
 * @property {string | null} publishedAt - ISO publication date, or null.
 * @property {number} [readTimeInMinutes] - Estimated reading time in minutes.
 */
export interface ArticleDetailHeroMetaProps {
    publishedAt: string | null;
    readTimeInMinutes?: number;
}

/**
 * ArticleDetailHeroMeta
 *
 * @description
 * The meta line under the headline: the relative published date and the estimated read
 * time (ClockIcon), joined by a vertical Separator. Reuses the shared readTime key so no
 * new i18n string is introduced.
 *
 * @param publishedAt - ISO publication date, or null.
 * @param readTimeInMinutes - Estimated reading time in minutes.
 */
export function ArticleDetailHeroMeta({
    publishedAt,
    readTimeInMinutes
}: ArticleDetailHeroMetaProps) {
    const { t } = useTranslation();
    return (
        <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-sm">
            <RelativeDate date={publishedAt} />
            <Separator orientation="vertical" className="h-4" />
            <span className="flex items-center">
                <ClockIcon className="mr-1 size-3.5" />
                {t("articles.card.readTime", { count: readTimeInMinutes ?? 0 })}
            </span>
        </div>
    );
}
```

---

## 4. `ArticleDetail.Tags.tsx`

```tsx
import type { IArticleTagEntity } from "@/modules/articles/domain/entities/IArticleTagEntity";
import { Tag } from "@/shared/presentation/components/ui/Tag";

/**
 * Props for the ArticleDetail.Tags component.
 *
 * @interface ArticleDetailTagsProps
 * @property {IArticleTagEntity[]} tags - The article's tags.
 */
export interface ArticleDetailTagsProps {
    tags: IArticleTagEntity[];
}

/**
 * ArticleDetail.Tags
 *
 * @description
 * The tag block shown at the end of the article body. Renders each article tag as a Tag
 * pill in the hashtag style (prefix "#") linking to the tag-filtered articles feed
 * (/articles?tagSlug=<slug>). Renders nothing when the article has no tags. Set off from
 * the body above by a token-colored top border.
 *
 * @param tags - The article's tags.
 */
export function ArticleDetailTags({ tags }: ArticleDetailTagsProps) {
    if (tags.length === 0) return null;
    return (
        <div className="flex flex-wrap items-center gap-2 border-border border-t pt-6">
            {tags.map((tag) => (
                <Tag
                    key={tag.id}
                    as="a"
                    prefix="#"
                    size="md"
                    variant="outline"
                    href={`/articles?tagSlug=${tag.slug}`}
                >
                    {tag.name}
                </Tag>
            ))}
        </div>
    );
}
```

---

## Tasks

- [ ] `ArticleDetail.Hero` created — scoped props (7 fields), never the whole entity.
- [ ] `ArticleDetailHeroCover` — cover via `next/image` (`fill`, `priority`); `bg-muted` +
      `NewspaperIcon` fallback; gradient scrim; category chip bottom-left; author bottom-right.
- [ ] Category `Tag` above the title — `variant="primary"`, `as="span"`, no `prefix="#"`
      (category is not a hashtag).
- [ ] Title `<h1>` + headline `<p>` render with the editorial type scale (tokens only).
- [ ] `ArticleDetailHeroMeta` — `RelativeDate` · read time with `ClockIcon` and a vertical
      `Separator`; read time uses `t("articles.card.readTime", { count })` (reused key).
- [ ] `ArticleDetail.Tags` — `Tag` pills, `prefix="#"`, `as="a"`, `href="/articles?tagSlug=…"`;
      empty guard renders nothing.
- [ ] No new icon or primitive added (all exist: `Tag`, `UserAvatar`, `RelativeDate`,
      `Separator`, `ClockIcon`, `NewspaperIcon`).
- [ ] Renders from a dummy article in light + dark; author byline legible on the scrim; no
      hardcoded colors except the fixed `black/*` scrim and the on-scrim `text-white`.
- [ ] `tsc` + biome clean.

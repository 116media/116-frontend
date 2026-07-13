# The Tags Block

`ArticleDetail.Tags` renders the article's own tags — `IArticleTagEntity[]` — as a row of
`Tag` pills at the **end of the body**, after the [reading body](06-article-body.md) and
before the comments. It is a sub-composer of `ArticleDetail`, fed a **scoped prop** (`tags`)
and nothing else.

```text
ArticleDetail(entity)
└── ArticleDetail.Tags   { tags: IArticleTagEntity[] }
```

---

## Anatomy

Each tag is the shared **`Tag`** in the **exclusive-tags hashtag style** — `prefix="#"`,
matching the [`ArticlesToolbar.TagStrip`](../../../src/modules/articles/presentation/components/ArticlesToolbar/ArticlesToolbar.TagStrip.tsx)
pills. Unlike the header **category** (a taxonomy label, no `#` — see
[05-cover-and-header.md](05-cover-and-header.md)), these are the article's tags and carry
the `#`.

Each pill is a **link** back into the filtered feed: `as="a"`,
`href="/articles?tagSlug={slug}"` — clicking `#music` opens the articles grid pre-filtered
to that tag (the feed already reads `tagSlug` from the URL). If a non-navigating variant is
ever wanted, `as="span"` drops the link; the default here is the link.

```tsx
/**
 * ArticleDetail.Tags
 *
 * @description
 * The tag block shown at the end of the article body. Renders each article tag as a Tag
 * pill in the hashtag style (prefix "#") linking to the tag-filtered articles feed
 * (/articles?tagSlug=<slug>). Renders nothing when the article has no tags.
 *
 * @param tags - The article's tags.
 */
export function ArticleDetailTags({ tags }: ArticleDetailTagsProps) {
    if (tags.length === 0) return null;
    return (
        <div className="flex flex-wrap items-center gap-2  border-t pt-6">
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

- **Empty guard.** When `tags` is empty the component renders nothing — no empty rule, no
  dangling border.
- **Separation.** A `border-t ` with `pt-6` sets the block off from the body
  above it, consistent with the token-only rule (no hardcoded color).
- **Wrapping.** `flex flex-wrap gap-2` lets a long tag list flow onto multiple rows.

---

## Reused / new pieces

| Piece | Status | Notes |
|---|---|---|
| `Tag` | reused | `shared/presentation/components/ui/Tag` — `prefix="#"`, `variant="outline"`, `as="a"` |
| `IArticleTagEntity` | reused | `articles/domain/entities/IArticleTagEntity.ts` — `{ id, name, slug }` |
| `ArticleDetail.Tags` | **new** | Sub-composer, scoped `tags` prop |

No new icon or primitive is required — the `Tag`'s built-in `prefix` slot renders the `#`,
so no `HashIcon` / `TagIcon` is needed. (`TagIcon` / `HashIcon` are **not** in the barrel
today; because the `#` prefix is a plain string, none has to be added for this block.)

The full JSDoc'd snippet and checklist ship with the header spec's neighbors; this block is
small enough that its contract is fully captured above and cross-referenced from
[specs/00-index.md](specs/00-index.md).

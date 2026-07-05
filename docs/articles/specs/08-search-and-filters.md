# Spec 08 — Search & Filters

Design ref: [../16-search-and-filters.md](../16-search-and-filters.md).

Adds the filter toolbar (category dropdown + debounced search), the tag pill strip with
a searchable "All tags" popover, and the one new read (`getAllTags`). Categories and
popular tags reuse the existing use cases.

---

## 1. `getAllTags` read (new; categories + popular tags already exist)

Port method + impl + use case + DI, delegating to `api.publicGetAllTags`.

```ts
getAllTags(search?: string): Promise<Result<IArticleTagEntity[]>>;
```

```ts
async getAllTags(search?: string): Promise<Result<IArticleTagEntity[]>> {
    try {
        const response = await this.api.publicGetAllTags({ search });
        return ok(response.data.tags.map(ArticlesMapper.tagFromDto));
    } catch (error) {
        return err(ProblemMapper.toFailure(error));
    }
}
```

```ts
/**
 * GetAllTagsUseCase
 *
 * @description
 * Fetches every tag for the "All tags" popover, optionally filtered by a search term
 * (server-side). Delegates to the articles repository.
 */
export class GetAllTagsUseCase {
    private readonly repo: IArticlesRepositoryPort;
    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.repo = articlesRepository;
    }

    /**
     * @param search - Optional tag-name search term.
     * @returns A `Result` of the matching tags.
     */
    execute(search?: string): Promise<Result<IArticleTagEntity[]>> {
        return this.repo.getAllTags(search);
    }
}
```

Register `getAllTagsUseCase` in `articles.dependencies.ts` and the `Cradle` type.

## 2. Query hooks

```ts
/**
 * useArticleCategories
 *
 * @description
 * Fetches the active article categories for the filter dropdown. Cached under a stable
 * key; categories change rarely.
 */
export function useArticleCategories() {
    return useQuery<IArticleCategoryEntity[], Failure>({
        queryKey: articleKeys.categories,
        queryFn: async () => {
            const result = await container.cradle.getArticleCategoriesUseCase.execute();
            if (!result.ok) throw result.error;
            return result.value;
        }
    });
}

/**
 * useArticlePopularTags
 *
 * @description
 * Fetches the popular article tags shown inline in the tag strip.
 */
export function useArticlePopularTags() {
    return useQuery<IArticleTagEntity[], Failure>({
        queryKey: articleKeys.popularTags,
        queryFn: async () => {
            const result = await container.cradle.getArticlePopularTagsUseCase.execute();
            if (!result.ok) throw result.error;
            return result.value;
        }
    });
}

/**
 * useAllTags
 *
 * @description
 * Fetches every tag for the "All tags" popover, filtered by a (debounced) search term.
 * Only enabled while the popover is open, to avoid loading the full list eagerly.
 *
 * @param search - The popover's tag search term.
 * @param enabled - Whether the popover is open.
 */
export function useAllTags(search: string, enabled: boolean) {
    return useQuery<IArticleTagEntity[], Failure>({
        queryKey: articleKeys.allTags(search),
        enabled,
        queryFn: async () => {
            const result = await container.cradle.getAllTagsUseCase.execute(search || undefined);
            if (!result.ok) throw result.error;
            return result.value;
        }
    });
}
```

Extend the key factory:

```ts
export const articleKeys = {
    all: ["articles"] as const,
    feed: (filters: IArticleFeedFilters = {}) => [...articleKeys.all, "feed", filters] as const,
    categories: [...["articles"], "categories"] as const,
    popularTags: [...["articles"], "tags", "popular"] as const,
    allTags: (search: string) => [...["articles"], "tags", "all", search] as const
};
```

## 3. `ArticlesToolbar` (composition)

Colocated with the grid; controlled by the container.

```tsx
/**
 * Props for ArticlesToolbar.
 *
 * @interface ArticlesToolbarProps
 * @property {string} search - The current (raw) search text.
 * @property {(value: string) => void} onSearchChange - Emits the search text.
 * @property {string | undefined} categoryId - The selected category id, or undefined for all.
 * @property {(categoryId: string | undefined) => void} onCategoryChange - Emits the category.
 * @property {string | undefined} tagSlug - The selected tag slug, or undefined for none.
 * @property {(tagSlug: string | undefined) => void} onTagChange - Emits the tag.
 * @property {boolean} hasActiveFilters - Whether any filter is set (shows "Clear filters").
 * @property {() => void} onClear - Clears all filters.
 */
export interface ArticlesToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;
    categoryId: string | undefined;
    onCategoryChange: (categoryId: string | undefined) => void;
    tagSlug: string | undefined;
    onTagChange: (tagSlug: string | undefined) => void;
    hasActiveFilters: boolean;
    onClear: () => void;
}

/**
 * ArticlesToolbar
 *
 * @description
 * The filter region under the promoted feed: a category dropdown on the left and a
 * search input on the right (row 1), and the tag pill strip with an "All tags" popover
 * (row 2). Fully controlled — the container owns the filter state and re-queries the
 * feed on change. Shows a "Clear filters" control when any filter is active.
 */
export function ArticlesToolbar(props: ArticlesToolbarProps) {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <ArticlesCategorySelect
                    value={props.categoryId}
                    onChange={props.onCategoryChange}
                />
                <ArticlesSearchInput
                    value={props.search}
                    onChange={props.onSearchChange}
                />
            </div>
            <ArticlesTagStrip
                value={props.tagSlug}
                onChange={props.onTagChange}
            />
            {props.hasActiveFilters && <ArticlesClearFilters onClear={props.onClear} />}
        </div>
    );
}
```

## 4. `ArticlesSearchInput` (debounced)

```tsx
/**
 * Props for ArticlesSearchInput.
 *
 * @interface ArticlesSearchInputProps
 * @property {string} value - The raw search text (controlled).
 * @property {(value: string) => void} onChange - Emits the debounced search text.
 */
export interface ArticlesSearchInputProps {
    value: string;
    onChange: (value: string) => void;
}

/**
 * ArticlesSearchInput
 *
 * @description
 * The article search box: the shared Input with a leading search icon and a trailing
 * clear button. Debounces (~300ms) before emitting, so the feed re-pages once the user
 * pauses rather than on every keystroke.
 *
 * @param value - The raw search text.
 * @param onChange - Emits the debounced search text.
 */
export function ArticlesSearchInput({ value, onChange }: ArticlesSearchInputProps) {
    const { t } = useTranslation();
    return (
        <div className="relative w-full sm:max-w-xs">
            <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={t("articles.filters.searchPlaceholder")}
                className="px-9"
            />
            {value && (
                <Button
                    size="icon"
                    variant="ghost"
                    aria-label={t("articles.filters.clearSearch")}
                    onClick={() => onChange("")}
                    className="-translate-y-1/2 absolute top-1/2 right-1 size-7 rounded-full text-muted-foreground"
                >
                    <XIcon className="size-4" />
                </Button>
            )}
        </div>
    );
}
```

> Debounce lives in the container (it owns the raw vs. debounced split), or in a small
> `useDebouncedValue`. The input stays controlled and instant; only the value fed to
> `useArticlesFeed` is debounced. Search-on-Enter is the alternative — see the open
> choice in [../16-search-and-filters.md](../16-search-and-filters.md).

## 5. `ArticlesCategorySelect`

A single-select dropdown over `useArticleCategories()` with an "All categories" default.
Built on the existing `DropdownMenu` primitive (there is no standalone `Select`). Emits
`categoryId | undefined`.

```tsx
"use client";

import { useTranslation } from "react-i18next";

import { useArticleCategories } from "@/modules/articles/presentation/hooks/useArticleCategories";
import { Button } from "@/shared/presentation/components/ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/shared/presentation/components/ui/DropdownMenu";
import { ChevronDownIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Props for ArticlesCategorySelect.
 *
 * @interface ArticlesCategorySelectProps
 * @property {string | undefined} value - The selected category id, or undefined for all.
 * @property {(categoryId: string | undefined) => void} onChange - Emits the category id.
 */
export interface ArticlesCategorySelectProps {
    value: string | undefined;
    onChange: (categoryId: string | undefined) => void;
}

/**
 * ArticlesCategorySelect
 *
 * @description
 * Single-select category filter for the article feed, built on the DropdownMenu
 * primitive. Lists the active article categories from {@link useArticleCategories} with
 * an "All categories" default that clears the filter. The trigger shows the current
 * selection's name.
 *
 * @param value - The selected category id, or undefined for all.
 * @param onChange - Emits the selected category id (undefined clears it).
 */
export function ArticlesCategorySelect({ value, onChange }: ArticlesCategorySelectProps) {
    const { t } = useTranslation();
    const { data: categories = [] } = useArticleCategories();
    const selected = categories.find((category) => category.id === value);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full justify-between sm:w-56"
                >
                    <span className="truncate">
                        {selected?.name ?? t("articles.filters.allCategories")}
                    </span>
                    <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="start"
                className="max-h-72 w-56 overflow-y-auto"
            >
                <DropdownMenuItem onSelect={() => onChange(undefined)}>
                    {t("articles.filters.allCategories")}
                </DropdownMenuItem>
                {categories.map((category) => (
                    <DropdownMenuItem
                        key={category.id}
                        onSelect={() => onChange(category.id)}
                    >
                        {category.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
```

## 6. `ArticlesTagStrip` + `orderTags` + `ArticlesAllTagsPopover`

`orderTags` keeps the active tag visible by pinning it to the front when it is not among
the popular tags:

```ts
/**
 * Orders the tag strip so the active tag is always visible: if the active `value` is not
 * already among the popular tags, it is prepended. Otherwise the popular order is kept.
 *
 * @param popular - The popular tags from the API.
 * @param value - The active tag slug, or undefined.
 * @returns The tags to render, active-first when needed.
 */
export function orderTags(
    popular: IArticleTagEntity[],
    value: string | undefined
): IArticleTagEntity[] {
    if (!value || popular.some((tag) => tag.slug === value)) return popular;
    const active = popular.find((tag) => tag.slug === value)
        ?? { id: value, name: value, slug: value };
    return [active, ...popular];
}
```

```tsx
/**
 * ArticlesTagStrip
 *
 * @description
 * A horizontally scrollable row of popular tag pills plus an "All tags" trigger opening
 * {@link ArticlesAllTagsPopover}. Single-select: the active tag is highlighted and
 * pinned to the front; clicking it clears the filter. Emits `tagSlug | undefined`.
 *
 * @param value - The active tag slug, or undefined.
 * @param onChange - Emits the selected tag slug (undefined to clear).
 */
export function ArticlesTagStrip({
    value,
    onChange
}: {
    value: string | undefined;
    onChange: (tagSlug: string | undefined) => void;
}) {
    const { data: popular = [] } = useArticlePopularTags();
    return (
        <div className="flex items-center gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
                {orderTags(popular, value).map((tag) => (
                    <Tag
                        as="span"
                        key={tag.slug}
                        prefix="#"
                        variant={tag.slug === value ? "primary" : "outline"}
                        onClick={() => onChange(tag.slug === value ? undefined : tag.slug)}
                    >
                        {tag.name}
                    </Tag>
                ))}
            </div>
            <ArticlesAllTagsPopover value={value} onChange={onChange} />
        </div>
    );
}
```

> The pills are `Tag as="span"` (not the default `"a"`) with an `onClick` — single-select
> toggle. The active pill is `variant="primary"`, the rest `variant="outline"`.

`ArticlesAllTagsPopover` — the "All tags" trigger and its searchable panel. No `Popover`
primitive exists, so it is a small absolutely-positioned panel dismissed via the shared
`useDismiss` hook (the page is not a modal, so no portal is needed):

```tsx
"use client";

import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAllTags } from "@/modules/articles/presentation/hooks/useAllTags";
import { useDebouncedValue } from "@/shared/presentation/hooks/useDebouncedValue";
import { useDismiss } from "@/shared/presentation/hooks/useDismiss";
import { Button } from "@/shared/presentation/components/ui/Button";
import { Input } from "@/shared/presentation/components/ui/Input";
import { CheckIcon } from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn";

/**
 * ArticlesAllTagsPopover
 *
 * @description
 * The "All tags" trigger and its dropdown panel: a search field over the full tag list
 * (from {@link useAllTags}, enabled only while open and keyed by the debounced search
 * term) rendered as selectable rows. Selecting a tag emits its slug and closes; the
 * active tag shows a check. Dismissed on outside-click / Escape via {@link useDismiss}.
 *
 * @param value - The active tag slug, or undefined.
 * @param onChange - Emits the selected tag slug (undefined to clear).
 */
export function ArticlesAllTagsPopover({
    value,
    onChange
}: {
    value: string | undefined;
    onChange: (tagSlug: string | undefined) => void;
}) {
    const { t } = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const debounced = useDebouncedValue(search, 300);
    const { data: tags = [] } = useAllTags(debounced, open);

    useDismiss(open, () => setOpen(false), containerRef);

    const select = (slug: string) => {
        onChange(slug === value ? undefined : slug);
        setOpen(false);
        setSearch("");
    };

    return (
        <div ref={containerRef} className="relative shrink-0">
            <Button
                variant="outline"
                onClick={() => setOpen((previous) => !previous)}
            >
                {t("articles.filters.allTags")}
            </Button>
            {open && (
                <div className="absolute right-0 z-20 mt-1 flex max-h-72 w-64 flex-col overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                    <div className="shrink-0 p-2">
                        <Input
                            autoFocus
                            value={search}
                            placeholder={t("articles.filters.tagSearch")}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </div>
                    <ul className="flex-1 overflow-y-auto p-1">
                        {tags.map((tag) => (
                            <li key={tag.slug}>
                                <button
                                    type="button"
                                    onClick={() => select(tag.slug)}
                                    className={cn(
                                        "flex w-full cursor-pointer items-center gap-2 rounded-sm p-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                                        tag.slug === value && "bg-accent/50"
                                    )}
                                >
                                    <span className="truncate">{tag.name}</span>
                                    {tag.slug === value && (
                                        <CheckIcon className="ml-auto size-4 shrink-0" />
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
```

---

## Tasks

- [x] `getAllTags` port + impl + `GetAllTagsUseCase` + DI + `Cradle`.
- [x] `useArticleCategories`, `useArticlePopularTags`, `useAllTags` hooks + key factory entries.
- [x] `ArticlesToolbar` (category select + search, row 1; tag strip, row 2; clear filters).
- [x] `ArticlesSearchInput` — debounced, clearable, leading icon.
- [x] `ArticlesCategorySelect` — active categories + "All categories" default (single).
- [x] `orderTags` helper — pins the active tag to the front when not in the popular set.
- [x] `ArticlesTagStrip` — popular `Tag as="span"` pills, active pinned + highlighted, single-select.
- [x] `ArticlesAllTagsPopover` — `useDismiss` panel, searchable full list via `useAllTags`.
- [x] Container owns `{ search, categoryId, tagSlug }` and feeds `useArticlesFeed`.
- [x] Responsive: search full-width on mobile; strip scrolls.
- [x] `tsc` + biome clean.

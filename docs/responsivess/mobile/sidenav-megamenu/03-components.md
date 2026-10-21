# Components

## Folder layout

`MobileMegaMenu` is a compound: one folder, dotted parts, no nesting, per the
`AGENTS.md` compound exception.

```text
src/shared/presentation/layouts/MobileMegaMenu/
├── MobileMegaMenu.tsx            # root: Dialog, Tabs, swipe
├── MobileMegaMenu.Header.tsx     # logo + close
├── MobileMegaMenu.Section.tsx    # heading + slot
├── MobileMegaMenu.Featured.tsx   # accent panel + "view all"
├── MobileMegaMenu.Tags.tsx       # popular tag cloud
├── MobileMegaMenu.Footer.tsx     # auth + theme + language
├── constants.ts                  # tab definitions (R13 carve-out)
├── types.ts                      # shared by >= 2 files in the folder
└── index.ts                      # assembles the namespace
```

Two module-side panels, each next to the mega menu it mirrors:

```text
src/modules/articles/presentation/components/navigation/ArticlesMobileMenu/
├── ArticlesMobileMenu.tsx
└── index.ts

src/modules/videos/presentation/components/navigation/VideosMobileMenu/
├── VideosMobileMenu.tsx
└── index.ts
```

They stay in their modules for the same reason `ArticlesMegaMenu` does: they read
module entities and build module paths. `MobileMegaMenu` imports both, exactly as
`Header` already imports both mega menu prop types.

## Reused as-is

| Component | Path | Used for |
| --- | --- | --- |
| `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | `ui/Tabs` | The four sections |
| `MegaMenuRow` | `ui/MegaMenuRow` | Every category row |
| `Tag` | `ui/Tag` | The popular tag cloud |
| `Logo` | `ui/Logo` | Panel header mark |
| `Button` | `ui/Button` | Close, auth |
| `ThemeToggle` | `common/ThemeToggle` | Footer |
| `LanguageDropdown` | `common/LanguageDropdown` | Footer |
| `UserAccountControl` | `common/UserAccountControl` | Footer |
| `ArticlesMegaMenuCard.Compact` | `articles/.../ArticlesMegaMenuCard` | À la une |
| `VideosMegaMenuCard.Compact` | `videos/.../VideosMegaMenuCard` | À la une |

Nothing in this list is modified. The only existing file that changes is `Header`
(see 09), and `MobileNav` is deleted.

## `types.ts`

```ts
import type { ArticlesMegaMenuProps } from "@/modules/articles/presentation/components/navigation/ArticlesMegaMenu/types";
import type { VideosMegaMenuProps } from "@/modules/videos/presentation/components/navigation/VideosMegaMenu/types";

/**
 * Props for the MobileMegaMenu root.
 *
 * @interface MobileMegaMenuProps
 * @property {ArticlesMegaMenuProps} articles - Prefetched articles menu data.
 * @property {VideosMegaMenuProps} videos - Prefetched videos menu data.
 */
export interface MobileMegaMenuProps {
    articles: ArticlesMegaMenuProps;
    videos: VideosMegaMenuProps;
}

/**
 * Props shared by the section parts that wrap a heading around a slot.
 *
 * @interface MobileMegaMenuSectionProps
 * @property {string} title - The already-localized section heading.
 * @property {ReactNode} children - The section body.
 * @property {string} [className] - Extra classes merged onto the section.
 */
export interface MobileMegaMenuSectionProps {
    title: string;
    children: ReactNode;
    className?: string;
}
```

## `constants.ts`

The four tabs, as an R13 carve-out (a folder-local record too large to inline):

```ts
import { ARTICLES_PATH, ARTISTES_PATH, LYRICS_PATH, VIDEOS_PATH } from "@/shared/presentation/constants/paths";

/**
 * The mobile menu's four sections, in render order. `label` is an i18n key inside
 * the `navigation` namespace; `href` is where a section with no panel navigates.
 */
export const MOBILE_MENU_TABS = [
    { value: "news", label: "navigation.mobileMenu.news", href: ARTICLES_PATH },
    { value: "videos", label: "navigation.mobileMenu.videos", href: VIDEOS_PATH },
    { value: "artistes", label: "navigation.mobileMenu.artistes", href: ARTISTES_PATH },
    { value: "lyrics", label: "navigation.mobileMenu.lyrics", href: LYRICS_PATH }
] as const;

/**
 * Horizontal travel, in px, past which a drag closes the panel instead of
 * springing back. Roughly a third of a 390px phone.
 */
export const SWIPE_CLOSE_THRESHOLD = 120;
```

## `MobileMegaMenu.tsx` (root)

```tsx
"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ArticlesMobileMenu } from "@/modules/articles/presentation/components/navigation/ArticlesMobileMenu";
import { VideosMobileMenu } from "@/modules/videos/presentation/components/navigation/VideosMobileMenu";
import { Button } from "@/shared/presentation/components/ui/Button";
import { MenuIcon } from "@/shared/presentation/components/ui/Icon";
import { MegaMenuRow } from "@/shared/presentation/components/ui/MegaMenuRow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/presentation/components/ui/Tabs";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

import { MOBILE_MENU_TABS } from "./constants";
import { MobileMegaMenuFooter } from "./MobileMegaMenu.Footer";
import { MobileMegaMenuHeader } from "./MobileMegaMenu.Header";
import type { MobileMegaMenuProps } from "./types";

/**
 * MobileMegaMenu
 *
 * @description
 * The mega menu below `md`: a full-screen panel sliding in from the left, with the
 * four nav sections on the shared Tabs primitive. Owns the open state and the active
 * tab; the per-section panels come from each content module.
 */
export function MobileMegaMenu({ articles, videos }: MobileMegaMenuProps) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const close = () => setIsOpen(false);

    return (
        <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
            <DialogPrimitive.Trigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                    aria-label={t("navigation.mobileMenu.open")}
                    className="text-muted-foreground hover:text-foreground md:hidden"
                >
                    <MenuIcon />
                </Button>
            </DialogPrimitive.Trigger>

            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay
                    className={cn(
                        "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden",
                        "data-[state=open]:animate-dialog-overlay-in",
                        "data-[state=closed]:animate-dialog-overlay-out"
                    )}
                />
                <DialogPrimitive.Content
                    aria-describedby={undefined}
                    className={cn(
                        "fixed inset-0 z-50 flex flex-col bg-background md:hidden",
                        "data-[state=open]:animate-sheet-in-left",
                        "data-[state=closed]:animate-sheet-out-left"
                    )}
                >
                    <DialogPrimitive.Title className="sr-only">
                        {t("navigation.mobileMenu.title")}
                    </DialogPrimitive.Title>

                    <MobileMegaMenuHeader />

                    <Tabs defaultValue={MOBILE_MENU_TABS[0].value} size="md" className="flex min-h-0 flex-1 flex-col">
                        <TabsList className="w-full justify-between rounded-none border-outlined border-b bg-transparent px-2">
                            {MOBILE_MENU_TABS.map(({ value, label }) => (
                                <TabsTrigger key={value} value={value} className="flex-1 uppercase tracking-wide">
                                    {t(label)}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                            <TabsContent value="news">
                                <ArticlesMobileMenu {...articles} onNavigate={close} />
                            </TabsContent>
                            <TabsContent value="videos">
                                <VideosMobileMenu {...videos} onNavigate={close} />
                            </TabsContent>
                            {MOBILE_MENU_TABS.slice(2).map(({ value, label, href }) => (
                                <TabsContent key={value} value={value} className="p-4">
                                    <MegaMenuRow href={href} label={t(label)} onNavigate={close} />
                                </TabsContent>
                            ))}
                        </div>
                    </Tabs>

                    <MobileMegaMenuFooter onNavigate={close} />
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
```

`aria-describedby={undefined}` is required: Radix warns when a `Dialog.Content` has
no `Description`, and this panel has none by design.

## `MobileMegaMenu.Header.tsx`

```tsx
"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/presentation/components/ui/Button";
import { XIcon } from "@/shared/presentation/components/ui/Icon";
import { Logo } from "@/shared/presentation/components/ui/Logo";
import { APP_NAME } from "@/shared/infrastructure/constants/common";

/**
 * MobileMegaMenu.Header
 *
 * @description
 * Pinned top row of the mobile menu: the brand mark and wordmark on the left, the
 * close control on the right.
 */
export function MobileMegaMenuHeader() {
    const { t } = useTranslation();

    return (
        <div className="flex items-center gap-3 px-4 py-3">
            <Logo className="size-9" />
            <span className="font-bold text-lg tracking-wide">{APP_NAME}</span>

            <DialogPrimitive.Close asChild>
                <Button
                    size="icon"
                    variant="ghost"
                    aria-label={t("navigation.mobileMenu.close")}
                    className="ml-auto text-muted-foreground hover:text-foreground"
                >
                    <XIcon />
                </Button>
            </DialogPrimitive.Close>
        </div>
    );
}
```

`Logo` is rendered without `canRedirect`: inside a dialog, a link to `/` would
navigate behind the open panel.

## `MobileMegaMenu.Section.tsx`

```tsx
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

import type { MobileMegaMenuSectionProps } from "./types";

/**
 * MobileMegaMenu.Section
 *
 * @description
 * One labelled block inside a tab panel: an uppercase heading above its content,
 * matching the mega menu's column headings.
 */
export function MobileMegaMenuSection({ title, children, className }: MobileMegaMenuSectionProps) {
    return (
        <section className={cn("flex flex-col gap-3 px-4 py-4", className)}>
            <h3 className="font-bold text-muted-foreground text-xs uppercase tracking-wider">
                {title}
            </h3>
            {children}
        </section>
    );
}
```

## `MobileMegaMenu.Featured.tsx`

```tsx
"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { ChevronRightIcon, StarIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Props for MobileMegaMenu.Featured.
 *
 * @interface MobileMegaMenuFeaturedProps
 * @property {string} viewAllHref - Destination of the trailing link.
 * @property {() => void} onNavigate - Closes the panel once the link is followed.
 * @property {ReactNode} children - The card grid.
 */
export interface MobileMegaMenuFeaturedProps {
    viewAllHref: string;
    onNavigate: () => void;
    children: ReactNode;
}

/**
 * MobileMegaMenu.Featured
 *
 * @description
 * The accent-tinted "À la une" block: a starred heading with a view-all link above
 * the promoted card grid, mirroring the mega menu's centre column.
 */
export function MobileMegaMenuFeatured({ viewAllHref, onNavigate, children }: MobileMegaMenuFeaturedProps) {
    const { t } = useTranslation();

    return (
        <section className="mx-4 flex flex-col gap-3 rounded-lg bg-primary/5 p-4 dark:bg-secondary/10">
            <div className="flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-1.5 font-bold text-primary text-xs uppercase tracking-wider dark:text-secondary">
                    <StarIcon className="size-3.5" aria-hidden="true" />
                    {t("general.featured")}
                </h3>
                <Link
                    href={viewAllHref}
                    onClick={onNavigate}
                    className="flex items-center gap-0.5 font-medium text-primary text-xs hover:underline dark:text-secondary"
                >
                    {t("general.viewAll")}
                    <ChevronRightIcon className="size-3.5" aria-hidden="true" />
                </Link>
            </div>
            {children}
        </section>
    );
}
```

## `MobileMegaMenu.Tags.tsx`

```tsx
"use client";

import { useTranslation } from "react-i18next";

import { Tag } from "@/shared/presentation/components/ui/Tag";

import { MobileMegaMenuSection } from "./MobileMegaMenu.Section";
import type { MobileMegaMenuTagsProps } from "./types";

/**
 * MobileMegaMenu.Tags
 *
 * @description
 * The popular tag cloud, same pills and same tag-filter links as the mega menu's
 * right column. Renders nothing when the list is empty.
 */
export function MobileMegaMenuTags({ tags, basePath, onNavigate }: MobileMegaMenuTagsProps) {
    const { t } = useTranslation();

    if (tags.length === 0) return null;

    return (
        <MobileMegaMenuSection title={t("general.popularTags")}>
            <div className="flex flex-wrap gap-2">
                {tags.slice(0, 16).map((tag) => (
                    <Tag
                        size="lg"
                        prefix="#"
                        shape="pill"
                        key={tag.id}
                        variant="default"
                        onClick={onNavigate}
                        href={`${basePath}?tagId=${tag.id}`}
                    >
                        {tag.name}
                    </Tag>
                ))}
            </div>
        </MobileMegaMenuSection>
    );
}
```

The `slice(0, 16)` cap matches `MegaMenuShell` so both surfaces show the same set.

`Tag` extends `HTMLAttributes<HTMLElement>` and spreads its rest props, so `onClick`
lands on the element. Note that `Tag` renders a plain `<a href>`, **not** a
`next/link`, so a tag tap is a full document navigation that tears the dialog down on
its own. `onNavigate` is passed anyway so the behaviour survives `Tag` being switched
to `Link` later, which it should be: every tag tap in the mega menu is a full page
reload today.

## `MobileMegaMenu.Footer.tsx`

The user's instruction is explicit: keep the current theme and language controls.
The artboard's segmented `Clair / Sombre` and `FR / EN` groups are **not** built.

```tsx
"use client";

import { LanguageDropdown } from "@/shared/presentation/components/common/LanguageDropdown";
import { ThemeToggle } from "@/shared/presentation/components/common/ThemeToggle";
import { UserAccountControl } from "@/shared/presentation/components/common/UserAccountControl";

/**
 * Props for MobileMegaMenu.Footer.
 *
 * @interface MobileMegaMenuFooterProps
 * @property {() => void} onNavigate - Closes the panel when the account control navigates.
 */
export interface MobileMegaMenuFooterProps {
    onNavigate: () => void;
}

/**
 * MobileMegaMenu.Footer
 *
 * @description
 * Pinned bottom row: the auth control on the left, theme and language on the right,
 * the same three components the header renders above `md`.
 */
export function MobileMegaMenuFooter({ onNavigate }: MobileMegaMenuFooterProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 border-outlined border-t px-4 py-3">
            <UserAccountControl onNavigate={onNavigate} />
            <div className="flex items-center gap-1">
                <ThemeToggle />
                <LanguageDropdown placement="top" />
            </div>
        </div>
    );
}
```

`placement="top"` so the language list opens upward out of a bottom-pinned row.

## `ArticlesMobileMenu.tsx`

```tsx
"use client";

import { useTranslation } from "react-i18next";

import { ArticlesMegaMenuCard } from "@/modules/articles/presentation/components/cards/ArticlesMegaMenuCard";
import type { ArticlesMobileMenuProps } from "@/modules/articles/presentation/components/navigation/ArticlesMobileMenu/types";
import { MegaMenuRow } from "@/shared/presentation/components/ui/MegaMenuRow";
import { ARTICLES_PATH } from "@/shared/presentation/constants/paths";
import {
    MobileMegaMenuFeatured,
    MobileMegaMenuSection,
    MobileMegaMenuTags
} from "@/shared/presentation/layouts/MobileMegaMenu";

/**
 * ArticlesMobileMenu
 *
 * @description
 * The NEWS panel of the mobile menu: every article category with its published
 * count, the promoted cards, and the popular tags. Mirrors ArticlesMegaMenu with
 * the columns stacked.
 */
export function ArticlesMobileMenu({ categories, promotedArticles, popularTags, onNavigate }: ArticlesMobileMenuProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col pb-4">
            <MobileMegaMenuSection title={t("articles.home.categories")}>
                <div className="flex flex-col">
                    <MegaMenuRow href={ARTICLES_PATH} label={t("general.all")} onNavigate={onNavigate} />
                    {categories.map((category) => (
                        <MegaMenuRow
                            key={category.id}
                            label={category.name}
                            onNavigate={onNavigate}
                            count={category.publishedCount}
                            href={`${ARTICLES_PATH}?categoryId=${category.id}`}
                        />
                    ))}
                </div>
            </MobileMegaMenuSection>

            {promotedArticles.length > 0 && (
                <MobileMegaMenuFeatured viewAllHref={ARTICLES_PATH} onNavigate={onNavigate}>
                    <div className="grid grid-cols-1 gap-3 xs:grid-cols-2">
                        {promotedArticles.slice(0, 4).map((article) => (
                            <ArticlesMegaMenuCard.Compact key={article.id} article={article} />
                        ))}
                    </div>
                </MobileMegaMenuFeatured>
            )}

            <MobileMegaMenuTags tags={popularTags} basePath={ARTICLES_PATH} onNavigate={onNavigate} />
        </div>
    );
}
```

`VideosMobileMenu` is the same shape with `VIDEOS_PATH`, `VideosMegaMenuCard.Compact`,
and the extra "All shows" row at the bottom of the category list, matching
`VideosMegaMenu.CategoryList`.

## `MegaMenuRow` change

One prop added so a row can close the panel. Desktop call sites pass nothing and are
unaffected.

```diff
 export interface MegaMenuRowProps {
     href: string;
     label: string;
     count?: number;
+    /** Called after the row navigates; the mobile menu uses it to close itself. */
+    onNavigate?: () => void;
 }
```

```diff
-export function MegaMenuRow({ href, label, count }: MegaMenuRowProps) {
+export function MegaMenuRow({ href, label, count, onNavigate }: MegaMenuRowProps) {
     return (
         <div className="border-outlined/50 border-b py-1 first:border-b-0">
-            <Link href={href} className={cn(...)}>
+            <Link href={href} onClick={onNavigate} className={cn(...)}>
```

`MegaMenuRow` is a server component today. Adding an `onClick` makes it a client
component, so it needs `"use client"` at the top. Both mega menu category lists are
already `"use client"`, so nothing else changes.

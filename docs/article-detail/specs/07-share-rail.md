# Spec 07 — Share Rail

Design ref: [../08-share-rail.md](../08-share-rail.md). Reuses `useShareArticle` /
`shareArticleUseCase` from the feed ([../03-backend-api-reference.md](../03-backend-api-reference.md)
§3). Brand marks from `@icons-pack/react-simple-icons`; copy-link glyph from the barrel.

---

## 1. Barrel prerequisite — `LinkIcon`

The icon barrel does not re-export a link/copy glyph. Add one to
`src/shared/presentation/components/ui/Icon/lucide.ts`:

```ts
export {
    Link as LinkIcon
} from "lucide-react";
```

Then `LinkIcon` is importable from `@/shared/presentation/components/ui/Icon` like every
other icon. See [../19-open-questions.md](../19-open-questions.md).

---

## 2. `buildShareUrl` — pure intent-URL helper

`src/modules/articles/presentation/components/ArticleDetail/shareUrl.ts`

```ts
/**
 * SharePlatform
 *
 * @description
 * The social networks the share rail surfaces a per-platform intent URL for. Copy-link is
 * not a platform here — it writes to the clipboard and has no intent URL.
 */
export type SharePlatform = "facebook" | "x" | "whatsapp";

/**
 * buildShareUrl
 *
 * @description
 * Builds the share-intent URL for one network from the absolute article URL and title.
 * Pure and side-effect free: both inputs are URL-encoded and interpolated into the
 * network's documented share endpoint. Facebook ignores custom text (it scrapes Open
 * Graph); X and WhatsApp carry the title as the message.
 *
 * @param platform - The target network.
 * @param url - The absolute article URL (for example `https://host/articles/{slug}`).
 * @param title - The article title, used as the share message where the network supports it.
 * @returns The fully-qualified share-intent URL to open in a new window.
 */
export function buildShareUrl(platform: SharePlatform, url: string, title: string): string {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    switch (platform) {
        case "facebook":
            return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        case "x":
            return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        case "whatsapp":
            return `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
    }
}
```

---

## 3. Copy-link notification config

Copy-link copy lives in a `*.notification.ts` config, resolved from the i18n catalog — never
inline at the call site.

`src/modules/articles/presentation/notifications/share.notification.ts`

```ts
import type { TFunction } from "i18next";

import type { INotificationConfig } from "@/shared/presentation/utils/notification";

/**
 * shareLinkCopiedNotification
 *
 * @description
 * Success toast shown after the article URL is copied to the clipboard by the share rail's
 * copy-link button. Copy is resolved from the articles i18n catalog so it stays localized
 * and centralized.
 *
 * @param t - The i18next translation function bound to the active locale.
 * @returns The notification config passed to {@link showNotification}.
 */
export function shareLinkCopiedNotification(t: TFunction): INotificationConfig {
    return {
        type: "success",
        title: t("articles.share.copied.title"),
        description: t("articles.share.copied.description")
    };
}
```

---

## 4. `ArticleDetail.ShareRail`

`src/modules/articles/presentation/components/ArticleDetail/ArticleDetail.ShareRail.tsx`

```tsx
"use client";

import { SiFacebook, SiWhatsapp, SiX } from "@icons-pack/react-simple-icons";
import { useTranslation } from "react-i18next";

import container from "@/shared/infrastructure/service.locator";
import { Button } from "@/shared/presentation/components/ui/Button";
import { LinkIcon } from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn";
import { showNotification } from "@/shared/presentation/utils/notification";

import { shareLinkCopiedNotification } from "../../notifications/share.notification";
import { buildShareUrl, type SharePlatform } from "./shareUrl";

/**
 * Props for ArticleDetail.ShareRail.
 *
 * @interface ArticleDetailShareRailProps
 * @property {string} articleId - The article the backend share event is recorded against.
 * @property {string} slug - The article slug, used to build the absolute URL on the server.
 * @property {string} title - The article title, carried into the share message.
 */
export interface ArticleDetailShareRailProps {
    articleId: string;
    slug: string;
    title: string;
}

/**
 * resolveArticleUrl
 *
 * @description
 * Resolves the absolute article URL. Prefers `window.location.href` in the browser; falls
 * back to the public site base plus the article path so the value is defined during SSR.
 *
 * @param slug - The article slug, used for the SSR fallback path.
 * @returns The absolute article URL.
 */
function resolveArticleUrl(slug: string): string {
    if (typeof window !== "undefined") return window.location.href;
    return `${process.env.NEXT_PUBLIC_SITE_URL}/articles/${slug}`;
}

/**
 * recordShare
 *
 * @description
 * Records the share against the article, fire-and-forget. The platform label is client-side
 * context only — the backend stores a bare share event and never receives the platform. The
 * promise is intentionally not awaited and its failure is swallowed so telemetry never
 * blocks or breaks the share surface.
 *
 * @param articleId - The article the share is recorded against.
 * @param platform - The platform label for client-side context.
 */
function recordShare(articleId: string, platform: string): void {
    void container.cradle.shareArticleUseCase.execute(articleId, platform);
}

/**
 * ArticleDetail.ShareRail
 *
 * @description
 * The article's share affordance: circular Facebook, X, WhatsApp, and copy-link buttons.
 * A vertical sticky rail on wide screens and a horizontal row on mobile. Each network
 * button prefers the native Web Share API and falls back to opening the platform's intent
 * URL in a new window; the copy-link button writes the URL to the clipboard and shows a
 * toast. Every action records the share against the backend, fire-and-forget. Brand marks
 * tint on hover — the one documented brand-color exception; all other colors are tokens.
 *
 * @param articleId - The article the backend share event is recorded against.
 * @param slug - The article slug, used to build the absolute URL on the server.
 * @param title - The article title, carried into the share message.
 */
export function ArticleDetailShareRail({ articleId, slug, title }: ArticleDetailShareRailProps) {
    const { t } = useTranslation();

    const shareTo = (platform: SharePlatform) => async () => {
        const url = resolveArticleUrl(slug);
        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share({ url, title });
            } catch {
                return;
            }
        } else {
            window.open(buildShareUrl(platform, url, title), "_blank", "noopener");
        }
        recordShare(articleId, platform);
    };

    const copyLink = async () => {
        const url = resolveArticleUrl(slug);
        await navigator.clipboard.writeText(url);
        showNotification(shareLinkCopiedNotification(t));
        recordShare(articleId, "clipboard");
    };

    return (
        <div className="flex flex-row items-center gap-2 lg:sticky lg:top-24 lg:flex-col">
            <Button
                size="icon"
                variant="ghost"
                aria-label={t("articles.share.facebook")}
                className={cn(
                    "size-9 rounded-full text-muted-foreground",
                    "hover:bg-muted hover:text-[#1877F2]"
                )}
                onClick={shareTo("facebook")}
            >
                <SiFacebook className="size-4" />
            </Button>

            <Button
                size="icon"
                variant="ghost"
                aria-label={t("articles.share.x")}
                className="size-9 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={shareTo("x")}
            >
                <SiX className="size-4" />
            </Button>

            <Button
                size="icon"
                variant="ghost"
                aria-label={t("articles.share.whatsapp")}
                className={cn(
                    "size-9 rounded-full text-muted-foreground",
                    "hover:bg-muted hover:text-[#25D366]"
                )}
                onClick={shareTo("whatsapp")}
            >
                <SiWhatsapp className="size-4" />
            </Button>

            <Button
                size="icon"
                variant="ghost"
                aria-label={t("articles.share.copy")}
                className="size-9 rounded-full text-muted-foreground hover:bg-muted hover:text-primary"
                onClick={copyLink}
            >
                <LinkIcon className="size-4" />
            </Button>
        </div>
    );
}
```

> **Brand-color exception.** The `hover:text-[#1877F2]` (Facebook) and `hover:text-[#25D366]`
> (WhatsApp) literals are the single documented hardcoded-color exception, for brand
> recognizability ([../08-share-rail.md](../08-share-rail.md)). X tints to `text-foreground`;
> copy-link tints to `text-primary` — both tokens. No other detail-page surface uses a
> non-token color.

---

## Tasks

- [ ] Add `Link as LinkIcon` to `Icon/lucide.ts` (barrel export).
- [ ] `shareUrl.ts` — `SharePlatform` type + pure `buildShareUrl(platform, url, title)` for Facebook / X / WhatsApp.
- [ ] `share.notification.ts` — `shareLinkCopiedNotification(t)` config (i18n copy).
- [ ] `ArticleDetail.ShareRail` — four circular icon buttons, scoped props (`articleId`, `slug`, `title`).
- [ ] Web Share API first (`navigator.share`), per-platform `window.open` fallback, copy-link → clipboard + toast.
- [ ] Every action calls `shareArticleUseCase.execute(articleId, platform)` fire-and-forget (unawaited, swallowed).
- [ ] Responsive layout: `flex-row` mobile, `lg:flex-col lg:sticky lg:top-24`.
- [ ] Brand tints documented as the color exception; X/copy use tokens; `aria-label` on every button.
- [ ] `tsc` + biome clean.

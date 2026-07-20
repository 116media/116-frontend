# Spec 01 — Server translation util

A single per-request `{ language, t }` accessor for use inside `generateMetadata` and any other
server-only code that needs a translated string before the React tree (and `I18nProvider`) exists.

---

## `getServerTranslation`

**`src/shared/presentation/utils/i18n/i18n.server.utils.ts`** (new file)

```ts
import { cache } from "react";
import type { TFunction } from "i18next";
import { createI18nInstance } from "@/shared/presentation/i18n/config";
import { getServerLanguage } from "@/shared/presentation/utils/language/language.server.utils";

/**
 * The resolved server language paired with a bound translation function.
 *
 * @property language - The active, validated language code for the current request.
 * @property t - A translation function bound to that language's i18next instance.
 */
export interface IServerTranslation {
    language: string;
    t: TFunction;
}

/**
 * getServerTranslation
 *
 * @description
 * Resolves the current request's language and returns a bound `t`, for use anywhere the
 * React tree isn't mounted yet (`generateMetadata`, other server-only code that runs before
 * `I18nProvider`). Memoized per request with React `cache`, mirroring the `fetchArticle`
 * pattern in the article-detail route, so a route calling this from both `generateMetadata`
 * and its page component shares one resolved language and one i18next instance.
 *
 * @returns The resolved language and a translation function bound to it.
 */
export const getServerTranslation = cache(async (): Promise<IServerTranslation> => {
    const language = await getServerLanguage();
    const { t } = createI18nInstance(language);
    return { language, t };
});
```

## Why this file, this location

- `createI18nInstance(lng)` and `getServerLanguage()` already exist and are already used
  elsewhere (`I18nProvider`, `server-client.ts`) — this util only composes them, it adds no new
  dependency.
- Per `AGENTS.md`'s utils convention, a new concern gets its own
  `presentation/utils/<concern>/<concern>.utils.ts` — here `<concern>.server.utils.ts` since it
  transitively reads cookies via `next/headers` and must stay out of any client bundle.
- `shared/presentation/utils/i18n/` is a new folder (i18n-adjacent utils don't currently have one
  of their own — `getClientLanguage`/`language.server.utils.ts` live under `utils/language/`,
  which is about resolving *which* language is active, not about *translating*). This keeps the
  "resolve the language" and "translate with it" concerns in separate files, matching how
  `config.ts`'s `createI18nInstance` is already a distinct concern from `language.server.utils.ts`.

## Task checklist

- [ ] Create `src/shared/presentation/utils/i18n/i18n.server.utils.ts` with the snippet above.
- [ ] `tsc --noEmit` clean.
- [ ] `biome check` clean.
- [ ] No import of this file from any Client Component (`"use client"`) — it transitively pulls in
  `next/headers`, which throws if imported into client code.

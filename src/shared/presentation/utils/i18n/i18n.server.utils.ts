import type { TFunction } from "i18next";
import { cache } from "react";
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

import type { Metadata } from "next";
import { Suspense } from "react";

import { ESearchScope } from "@/modules/search/domain/enums/ESearchScope";
import { SearchResultListLoading } from "@/modules/search/presentation/components/lists/SearchResultList";
import { SearchContainer } from "@/modules/search/presentation/containers/SearchContainer";
import { getServerTranslation } from "@/shared/presentation/utils/i18n/i18n.server.utils";

/**
 * generateMetadata
 *
 * @description
 * Names the search route in the active server language. The term is not in the title:
 * it would put a reader's query in the browser history and in any shared screenshot.
 *
 * @returns The route metadata for the current request's language.
 */
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getServerTranslation();

    return {
        title: t("search.meta.title"),
        robots: { index: false, follow: true }
    };
}

/**
 * SearchPage
 *
 * @description
 * The search route. Reads its term and scope from the URL, so a result page is
 * shareable and the back button steps through searches.
 */
export default function SearchPage() {
    return (
        <Suspense fallback={<SearchResultListLoading scope={ESearchScope.All} />}>
            <SearchContainer />
        </Suspense>
    );
}

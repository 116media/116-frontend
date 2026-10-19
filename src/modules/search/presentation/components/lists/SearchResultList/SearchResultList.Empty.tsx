"use client";

import { useTranslation } from "react-i18next";

import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { SearchXIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Props for the SearchResultList.Empty component.
 *
 * @interface SearchResultListEmptyProps
 * @property {string} query - The term that matched nothing, echoed back.
 */
export interface SearchResultListEmptyProps {
    query: string;
}

/**
 * SearchResultList.Empty
 *
 * @description
 * The no-match state, on the shared empty-state shell. Echoes the term so the reader
 * can see a typo. Height is collapsed from the shell's default, which is sized for a
 * whole page and would overflow the overlay panel.
 */
export function SearchResultListEmpty({ query }: SearchResultListEmptyProps) {
    const { t } = useTranslation();

    return (
        <EmptyState
            context="search-results"
            className="min-h-0 py-12"
            subtitle={t("search.empty.hint")}
            title={t("search.empty.title", { query })}
            icon={<SearchXIcon className="size-10" />}
        />
    );
}

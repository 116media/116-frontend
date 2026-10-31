"use client";

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { SearchXIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Props for the SearchResultList.Empty component.
 *
 * @interface SearchResultListEmptyProps
 * @property {string} query - The term that matched nothing, echoed back.
 * @property {ReactNode} [children] - Suggestions rendered under the message.
 */
export interface SearchResultListEmptyProps {
    query: string;
    children?: ReactNode;
}

/**
 * SearchResultList.Empty
 *
 * @description
 * The no-match state. Echoes the term so the reader can see a typo, then offers a way
 * back rather than leaving the screen blank.
 */
export function SearchResultListEmpty({ query, children }: SearchResultListEmptyProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-muted text-muted-foreground">
                <SearchXIcon
                    aria-hidden="true"
                    className="size-7"
                />
            </span>
            <h3 className="font-semibold text-foreground text-lg">
                {t("search.empty.title", { query })}
            </h3>
            <p className="max-w-sm text-muted-foreground text-sm">{t("search.empty.hint")}</p>
            {children}
        </div>
    );
}

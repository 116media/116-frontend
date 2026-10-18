"use client";

import { type ChangeEvent, type FormEvent, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { MAX_SEARCH_TERM_LENGTH } from "@/modules/search/presentation/constants/searchKeys";
import { SEARCH_FIELD_WIDTH } from "@/modules/search/presentation/constants/searchLayout";
import { SearchIcon, XIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Props for the SearchContainer.Field component.
 *
 * @interface SearchContainerFieldProps
 * @property {string} value - The current term.
 * @property {(value: string) => void} onValueChange - Called on every keystroke.
 */
export interface SearchContainerFieldProps {
    value: string;
    onValueChange: (value: string) => void;
}

/**
 * SearchContainer.Field
 *
 * @description
 * The route's own term input. Autofocused with the caret at the end, so a reader
 * carried here from the overlay keeps typing without noticing the jump.
 */
export function SearchContainerField({ value, onValueChange }: SearchContainerFieldProps) {
    const { t } = useTranslation();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const input = inputRef.current;
        if (!input) return;

        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
        // Mount only: refocusing on every keystroke would fight the reader's caret.
    }, []);

    return (
        <search>
            <form
                className={SEARCH_FIELD_WIDTH}
                onSubmit={(event: FormEvent<HTMLFormElement>) => event.preventDefault()}
            >
                <label
                    htmlFor="search-page-field"
                    className="flex h-13 items-center gap-3 rounded-xl border-2 border-primary bg-card px-4 dark:border-secondary"
                >
                    <SearchIcon
                        aria-hidden="true"
                        className="size-5 shrink-0 text-muted-foreground"
                    />
                    <input
                        type="search"
                        value={value}
                        ref={inputRef}
                        autoComplete="off"
                        enterKeyHint="search"
                        id="search-page-field"
                        maxLength={MAX_SEARCH_TERM_LENGTH}
                        aria-label={t("search.field.label")}
                        placeholder={t("search.field.placeholder")}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            onValueChange(event.target.value)
                        }
                        className="min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
                    />
                    {value && (
                        <button
                            type="button"
                            aria-label={t("search.field.clear")}
                            onClick={() => {
                                onValueChange("");
                                inputRef.current?.focus();
                            }}
                            className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                            <XIcon className="size-4" />
                        </button>
                    )}
                </label>
            </form>
        </search>
    );
}

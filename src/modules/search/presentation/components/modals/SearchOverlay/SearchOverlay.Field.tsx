"use client";

import { type ChangeEvent, type FormEvent, type KeyboardEvent, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
    MAX_SEARCH_TERM_LENGTH,
    MIN_SEARCH_TERM_LENGTH
} from "@/modules/search/presentation/constants/searchKeys";
import { SEARCH_FIELD_WIDTH } from "@/modules/search/presentation/constants/searchLayout";
import { SearchIcon, XIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Props for the SearchOverlay.Field component.
 *
 * @interface SearchOverlayFieldProps
 * @property {string} value - The current term.
 * @property {(value: string) => void} onValueChange - Called on every keystroke.
 * @property {() => void} onSubmit - Called when the reader commits the term.
 */
export interface SearchOverlayFieldProps {
    value: string;
    onValueChange: (value: string) => void;
    onSubmit: () => void;
}

/**
 * SearchOverlay.Field
 *
 * @description
 * The term input. Autofocused on open and clearable. Typing only filters the results
 * below it; committing is deliberate, through Enter or the submit button on the right,
 * and that is what carries the reader to the full results route.
 */
export function SearchOverlayField({ value, onValueChange, onSubmit }: SearchOverlayFieldProps) {
    const { t } = useTranslation();
    const inputRef = useRef<HTMLInputElement>(null);
    const canSubmit = value.trim().length >= MIN_SEARCH_TERM_LENGTH;

    useEffect(() => {
        // The panel traps focus on open; this moves it to the field rather than the panel.
        const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
        return () => window.cancelAnimationFrame(frame);
    }, []);

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit();
    };

    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Escape" && value) {
            // A term clears before the panel closes, so Escape never loses it by surprise.
            event.stopPropagation();
            onValueChange("");
        }
    };

    return (
        <search>
            <form
                onSubmit={submit}
                className={SEARCH_FIELD_WIDTH}
            >
                <label
                    htmlFor="search-overlay-field"
                    className="flex h-13 items-center gap-2 rounded-xl border-2 border-primary bg-card pr-1.5 pl-4 dark:border-secondary"
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
                        id="search-overlay-field"
                        onKeyDown={onKeyDown}
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
                            className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                            <XIcon className="size-4" />
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={!canSubmit}
                        aria-label={t("search.field.submit")}
                        className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-3 font-semibold text-primary-foreground text-sm transition-opacity hover:opacity-90 disabled:opacity-40 sm:px-4 dark:bg-secondary dark:text-secondary-foreground"
                    >
                        <SearchIcon className="size-4 shrink-0" />
                        {/* The word costs nothing where there is room, and a phone needs that room. */}
                        <span className="hidden sm:inline">{t("search.field.submitShort")}</span>
                    </button>
                </label>
            </form>
        </search>
    );
}

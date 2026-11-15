import { type RefObject, useEffect, useRef } from "react";

import type { ICountryObject } from "@/shared/infrastructure/constants/countries";
import { Input } from "@/shared/presentation/components/ui/Input";

import { CountryOption } from "./CountryOption";

/**
 * Props for the CountrySelectMenu component.
 *
 * @interface CountrySelectMenuProps
 * @property {ICountryObject[]} results - The filtered countries to list.
 * @property {string} query - The current search text.
 * @property {(query: string) => void} onQueryChange - Emits the search text on input.
 * @property {(name: string) => void} onSelect - Emits the chosen country name.
 * @property {RefObject<HTMLInputElement | null>} searchRef - Ref to the search input (autofocus).
 * @property {string} [value] - The selected country name (for the row's checked state).
 * @property {string} [placeholder] - Search prompt inside the field.
 */
export interface CountrySelectMenuProps {
    query: string;
    value?: string;
    placeholder?: string;
    results: ICountryObject[];
    onSelect: (name: string) => void;
    onQueryChange: (query: string) => void;
    searchRef: RefObject<HTMLInputElement | null>;
}

/**
 * CountrySelectMenu
 *
 * @description
 * The expanded panel of {@link CountrySelect}: a pinned search field over a scrollable
 * list of {@link CountryOption} rows. Renders in flow under the trigger, so a modal's
 * scrolling body cannot clip it and the footer cannot cover it.
 */
export function CountrySelectMenu({
    results,
    query,
    onQueryChange,
    onSelect,
    searchRef,
    value,
    placeholder
}: CountrySelectMenuProps) {
    const listRef = useRef<HTMLUListElement>(null);
    const selectedRef = useRef<HTMLLIElement>(null);

    // Scrolls the list itself rather than calling scrollIntoView, which would also
    // scroll the surrounding dialog body.
    useEffect(() => {
        const list = listRef.current;
        const item = selectedRef.current;
        if (!list || !item) return;
        list.scrollTop = item.offsetTop - list.clientHeight / 2 + item.clientHeight / 2;
    }, []);

    return (
        <div className="-mt-px flex max-h-72 flex-col overflow-hidden rounded-b-base border border-ring bg-popover text-popover-foreground">
            <div className="shrink-0 p-2">
                <Input
                    value={query}
                    ref={searchRef}
                    placeholder={placeholder}
                    className="py-4.5"
                    onChange={(event) => onQueryChange(event.target.value)}
                />
            </div>
            <ul
                ref={listRef}
                className="relative flex-1 overflow-y-auto overscroll-contain px-2 pb-2"
            >
                {results.map((country) => (
                    <li
                        key={country.isoCode}
                        ref={country.name === value ? selectedRef : undefined}
                    >
                        <CountryOption
                            country={country}
                            onSelect={onSelect}
                            selected={country.name === value}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}

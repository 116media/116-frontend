import type { RefObject } from "react";

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
 * The floating panel of {@link CountrySelect}: a pinned search field over a scrollable
 * list of {@link CountryOption} rows. Rendered in flow (absolutely positioned under the
 * trigger by the parent's `relative` container) so it stays inside any surrounding
 * focus/scroll scope — a modal keeps the search typeable and the list scrollable.
 *
 * @param results - The filtered countries to list.
 * @param query - The current search text.
 * @param onQueryChange - Emits the search text on input.
 * @param onSelect - Emits the chosen country name.
 * @param searchRef - Ref to the search input.
 * @param value - The selected country name.
 * @param placeholder - Search prompt inside the field.
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
    return (
        <div className="absolute top-full right-0 left-0 z-50 mt-1 flex max-h-72 flex-col overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
            <div className="shrink-0 p-2">
                <Input
                    value={query}
                    ref={searchRef}
                    placeholder={placeholder}
                    className="py-4.5 text-sm"
                    onChange={(event) => onQueryChange(event.target.value)}
                />
            </div>
            <ul className="flex-1 overflow-y-auto px-2 pb-2">
                {results.map((country) => (
                    <li key={country.isoCode}>
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

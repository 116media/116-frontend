"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { COUNTRY_LIST } from "@/shared/infrastructure/constants/countries";
import { useDismiss } from "@/shared/presentation/hooks/useDismiss";
import { findCountryByName } from "@/shared/presentation/utils/country/country.utils";

import { CountrySelectMenu } from "./CountrySelectMenu";
import { CountrySelectTrigger } from "./CountrySelectTrigger";

/**
 * Props for the CountrySelect component.
 *
 * @interface CountrySelectProps
 * @property {string} [value] - The selected country name.
 * @property {(name: string) => void} onChange - Emits the selected country name.
 * @property {string} label - The floating label (doubles as the resting placeholder).
 * @property {string} [error] - Inline error, shown below the field.
 * @property {boolean} [required] - Appends a `*` marker to the label.
 * @property {string} [id] - Id applied to the trigger for label association.
 * @property {string} [placeholder] - Search prompt inside the popover.
 */
export interface CountrySelectProps {
    id?: string;
    label: string;
    error?: string;
    value?: string;
    required?: boolean;
    placeholder?: string;
    onChange: (name: string) => void;
}

/**
 * CountrySelect
 *
 * @description
 * A searchable country picker composed from {@link CountrySelectTrigger} and
 * {@link CountrySelectMenu}. Owns the open/search/filter state and emits the selected
 * country name; the menu renders in flow so it stays usable inside modal dialogs.
 */
export function CountrySelect({
    value,
    onChange,
    label,
    error,
    required,
    id,
    placeholder
}: CountrySelectProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");

    const selected = findCountryByName(value);

    const results = useMemo(() => {
        const search = query.trim().toLowerCase();
        if (!search) return COUNTRY_LIST;
        return COUNTRY_LIST.filter(
            (country) =>
                country.name.toLowerCase().includes(search) ||
                country.dialCode.includes(search) ||
                country.isoCode.toLowerCase().includes(search)
        );
    }, [query]);

    const close = useCallback(() => setOpen(false), []);
    useDismiss(open, close, containerRef);

    useEffect(() => {
        if (open) searchRef.current?.focus();
    }, [open]);

    const select = (name: string) => {
        onChange(name);
        setOpen(false);
        setQuery("");
    };

    return (
        <div className="flex flex-col gap-1.5">
            <div
                ref={containerRef}
                className="relative"
            >
                <CountrySelectTrigger
                    id={id}
                    open={open}
                    label={label}
                    selected={selected}
                    error={Boolean(error)}
                    required={required}
                    onToggle={() => setOpen((previous) => !previous)}
                />

                {open && (
                    <CountrySelectMenu
                        value={value}
                        query={query}
                        results={results}
                        onSelect={select}
                        searchRef={searchRef}
                        placeholder={placeholder}
                        onQueryChange={setQuery}
                    />
                )}
            </div>
            {error && <p className="text-destructive text-xs">{error}</p>}
        </div>
    );
}

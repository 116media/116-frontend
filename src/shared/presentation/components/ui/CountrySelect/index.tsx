"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { COUNTRY_LIST } from "@/shared/infrastructure/constants/countries";
import { useDismiss } from "@/shared/presentation/hooks/useDismiss";
import { findCountryByName } from "@/shared/presentation/utils/country";

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
 * A searchable country picker composed from small parts: the floating-label
 * {@link CountrySelectTrigger}, the searchable {@link CountrySelectMenu} (a list of
 * {@link CountryOption} rows), and the shared {@link useDismiss} hook for outside-click /
 * Escape handling. This component owns only the state — open/close, the
 * search query, filtering the country list, and focusing the search field on open — and
 * emits the selected country name; the parent derives the ISO and dial codes.
 *
 * The menu renders in flow (absolutely positioned under the trigger), so it stays inside
 * any surrounding focus/scroll scope — a modal dialog keeps its search input typeable and
 * its list scrollable. It relies on its host container not clipping it, so a dialog that
 * hosts it must not put an `overflow` boundary between the field and the panel edge.
 *
 * @param value - The selected country name.
 * @param onChange - Emits the selected country name.
 * @param label - The floating label.
 * @param error - Inline error, shown below the field.
 * @param required - Appends a `*` marker to the label.
 * @param id - Id applied to the trigger for label association.
 * @param placeholder - Search prompt inside the popover.
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

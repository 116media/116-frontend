"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { COUNTRY_LIST } from "@/shared/infrastructure/constants/countries";
import { CheckIcon, ChevronsUpDownIcon } from "@/shared/presentation/components/ui/Icon";
import { Input } from "@/shared/presentation/components/ui/Input";
import { cn } from "@/shared/presentation/utils/cn";
import { findCountryByName } from "@/shared/presentation/utils/country";

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
    value?: string;
    onChange: (name: string) => void;
    label: string;
    error?: string;
    required?: boolean;
    id?: string;
    placeholder?: string;
}

/**
 * CountrySelect
 *
 * @description
 * A searchable country picker wearing the same floating-label chrome as
 * `FloatingField`, so it lines up with the other form fields. The trigger shows the
 * selected flag, dial code, and name; the label floats to the top once a country is
 * selected or the popover opens, and rests as the placeholder otherwise. The popover
 * holds a search field over the full country list (filtered by name, dial code, or ISO
 * code) and emits the country name only — the parent derives the ISO and dial codes.
 * Flags load from the CDN via a plain image tag, so no image-host configuration is
 * needed.
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
    const floated = open || Boolean(selected);

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

    useEffect(() => {
        if (!open) return;

        searchRef.current?.focus();

        const onPointerDown = (event: PointerEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
        };
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };

        document.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
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
                <button
                    id={id}
                    type="button"
                    aria-invalid={error ? true : undefined}
                    onClick={() => setOpen((previous) => !previous)}
                    className={cn(
                        "flex h-12 w-full cursor-pointer items-center gap-2 rounded-md border border-input bg-muted px-3 pt-4 text-left text-sm outline-none transition-colors",
                        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20",
                        open && "border-ring ring-3 ring-ring/20",
                        error && "border-destructive"
                    )}
                >
                    {selected && (
                        <span className="flex min-w-0 items-center gap-2">
                            <img
                                src={selected.flag}
                                alt={selected.isoCode}
                                className="h-3 w-5 shrink-0 object-cover"
                            />
                            <span className="text-muted-foreground">{selected.dialCode}</span>
                            <span className="truncate">{selected.name}</span>
                        </span>
                    )}
                    <ChevronsUpDownIcon className="ml-auto size-4 shrink-0 text-muted-foreground" />
                </button>

                <label
                    htmlFor={id}
                    className={cn(
                        "pointer-events-none absolute left-3 transition-all duration-200",
                        floated
                            ? "top-1.5 font-bold text-[10px] text-primary dark:text-secondary"
                            : "-translate-y-1/2 top-1/2 font-normal text-muted-foreground text-sm"
                    )}
                >
                    {label}
                    {required && <span className="ml-0.5 text-destructive">*</span>}
                </label>

                {open && (
                    <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                        <div className="p-2">
                            <Input
                                ref={searchRef}
                                value={query}
                                placeholder={placeholder}
                                onChange={(event) => setQuery(event.target.value)}
                            />
                        </div>
                        <ul className="max-h-64 overflow-y-auto pb-1">
                            {results.map((country) => (
                                <li key={country.isoCode}>
                                    <button
                                        type="button"
                                        onClick={() => select(country.name)}
                                        className={cn(
                                            "flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                                            country.name === value && "bg-accent/50"
                                        )}
                                    >
                                        <img
                                            loading="lazy"
                                            src={country.flag}
                                            alt={country.isoCode}
                                            className="h-3 w-5 shrink-0 object-cover"
                                        />
                                        <span className="w-12 shrink-0 text-muted-foreground">
                                            {country.dialCode}
                                        </span>
                                        <span className="truncate">{country.name}</span>
                                        {country.name === value && (
                                            <CheckIcon className="ml-auto size-4 shrink-0" />
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            {error && <p className="text-destructive text-xs">{error}</p>}
        </div>
    );
}

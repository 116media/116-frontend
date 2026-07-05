import type { ICountryObject } from "@/shared/infrastructure/constants/countries";
import { CheckIcon } from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn";

/**
 * Props for the CountryOption component.
 *
 * @interface CountryOptionProps
 * @property {ICountryObject} country - The country the row represents.
 * @property {boolean} selected - Whether this country is the current selection.
 * @property {(name: string) => void} onSelect - Emits the country name when the row is clicked.
 */
export interface CountryOptionProps {
    country: ICountryObject;
    selected: boolean;
    onSelect: (name: string) => void;
}

/**
 * CountryOption
 *
 * @description
 * A single selectable row inside the {@link CountrySelect} menu: the country flag, dial
 * code, and name, with a trailing check when it is the current selection. Shares the
 * spacing of the app's dropdown menu items (`gap-2 rounded-sm p-2`).
 *
 * @param country - The country the row represents.
 * @param selected - Whether this country is the current selection.
 * @param onSelect - Emits the country name when clicked.
 */
export function CountryOption({ country, selected, onSelect }: CountryOptionProps) {
    return (
        <button
            type="button"
            onClick={() => onSelect(country.name)}
            className={cn(
                "flex w-full cursor-pointer items-center gap-2 rounded-sm p-2 text-left text-sm",
                "transition-colors hover:bg-accent hover:text-accent-foreground",
                selected && "bg-accent/50"
            )}
        >
            <img
                loading="eager"
                src={country.flag}
                alt={country.isoCode}
                className="h-3 w-4.5 shrink-0 rounded-xs object-cover"
            />
            <span className="w-12 shrink-0 text-muted-foreground">{country.dialCode}</span>
            <span className="truncate">{country.name}</span>
            {selected && <CheckIcon className="ml-auto size-4 shrink-0" />}
        </button>
    );
}

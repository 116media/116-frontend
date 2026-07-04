import type { ICountryObject } from "@/shared/infrastructure/constants/countries";
import { ChevronsUpDownIcon } from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn";

/**
 * Props for the CountrySelectTrigger component.
 *
 * @interface CountrySelectTriggerProps
 * @property {string} label - The floating label (doubles as the resting placeholder).
 * @property {boolean} open - Whether the menu is open (drives the focus ring + floated label).
 * @property {() => void} onToggle - Toggles the menu open/closed.
 * @property {ICountryObject} [selected] - The selected country, shown in the trigger.
 * @property {string} [id] - Id applied to the button for label association.
 * @property {boolean} [required] - Appends a `*` marker to the label.
 * @property {boolean} [error] - Renders the invalid border/aria state.
 */
export interface CountrySelectTriggerProps {
    label: string;
    open: boolean;
    onToggle: () => void;
    selected?: ICountryObject;
    id?: string;
    required?: boolean;
    error?: boolean;
}

/**
 * CountrySelectTrigger
 *
 * @description
 * The button that opens the {@link CountrySelect} menu, wearing the shared floating-label
 * chrome so it lines up with the other form fields. Shows the selected flag, dial code,
 * and name; the label floats to the top once a country is selected or the menu opens,
 * and rests as the placeholder otherwise.
 *
 * @param label - The floating label.
 * @param open - Whether the menu is open.
 * @param onToggle - Toggles the menu.
 * @param selected - The selected country.
 * @param id - Id applied to the button.
 * @param required - Appends a `*` marker to the label.
 * @param error - Renders the invalid state.
 */
export function CountrySelectTrigger({
    label,
    open,
    onToggle,
    selected,
    id,
    required,
    error
}: CountrySelectTriggerProps) {
    const floated = open || Boolean(selected);

    return (
        <>
            <button
                id={id}
                type="button"
                onClick={onToggle}
                aria-invalid={error ? true : undefined}
                className={cn(
                    "flex h-12 w-full cursor-pointer items-center gap-2 rounded-md",
                    "border border-input bg-muted px-3 pt-4 text-left text-sm outline-none transition-colors",
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
        </>
    );
}

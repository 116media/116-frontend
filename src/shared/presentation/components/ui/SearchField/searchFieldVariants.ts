import { cva, type VariantProps } from "class-variance-authority";

/**
 * The search shell: the bordered box a reader types into, and the trigger that stands in
 * for it before an overlay opens. `filled` is the standalone control, `prominent` the
 * accent-edged field a search surface is built around, and `bare` drops the edge for a
 * field that already sits inside a bordered one.
 */
export const searchFieldVariants = cva(
    [
        "flex w-full min-w-0 items-center gap-3 text-left transition-colors",
        "focus-within:ring-2 focus-within:ring-ring/50"
    ].join(" "),
    {
        variants: {
            variant: {
                filled: "rounded-base border border-surface-hover bg-surface-sunken px-4",
                prominent:
                    "rounded-base border-2 border-primary bg-card px-4 dark:border-secondary",
                bare: "bg-transparent"
            },
            size: {
                sm: "h-9",
                md: "h-10",
                lg: "h-11",
                xl: "h-13"
            }
        },
        defaultVariants: { variant: "filled", size: "md" }
    }
);

/**
 * The typed text and the placeholder inside the shell, kept apart from the shell itself so
 * a trigger can wear the same voice without being an input.
 */
export const searchFieldTextVariants = cva(
    "min-w-0 flex-1 truncate bg-transparent text-field outline-none placeholder:text-subtle-foreground/65",
    {
        variants: {
            tone: {
                typed: "text-foreground",
                placeholder: "text-subtle-foreground/65"
            }
        },
        defaultVariants: { tone: "typed" }
    }
);

/**
 * One step of the search field size scale.
 */
export type SearchFieldSize = NonNullable<VariantProps<typeof searchFieldVariants>["size"]>;

/**
 * How the search shell presents itself.
 */
export type SearchFieldVariant = NonNullable<VariantProps<typeof searchFieldVariants>["variant"]>;

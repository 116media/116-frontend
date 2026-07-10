import { cva, type VariantProps } from "class-variance-authority";

/**
 * Size scale for the tab list and its triggers, from `xs` to `2xl`. Set on the
 * `Tabs` root and inherited by every `TabsList` / `TabsTrigger` through
 * context, or overridden per component with their own `size` prop.
 */
export const tabsTriggerVariants = cva(
    [
        "relative rounded-md font-medium text-muted-foreground transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        "data-[state=active]:text-foreground disabled:pointer-events-none disabled:opacity-50"
    ].join(" "),
    {
        variants: {
            size: {
                xs: "px-2 py-0.5 text-[11px]",
                sm: "px-2.5 py-1 text-xs",
                md: "px-3 py-1.5 text-sm",
                lg: "px-4 py-2 text-base",
                xl: "px-5 py-2.5 text-lg",
                "2xl": "px-6 py-3 text-xl"
            }
        },
        defaultVariants: { size: "sm" }
    }
);

/**
 * The tab-list padding paired to each trigger size, so the muted track hugs
 * the pills consistently across the scale.
 */
export const tabsListVariants = cva(
    "inline-flex items-center gap-1 rounded-lg bg-muted text-muted-foreground",
    {
        variants: {
            size: {
                xs: "p-0.5",
                sm: "p-1",
                md: "p-1",
                lg: "p-1.5",
                xl: "p-1.5",
                "2xl": "p-2"
            }
        },
        defaultVariants: { size: "sm" }
    }
);

/**
 * One step of the shared tabs size scale.
 */
export type TabsSize = NonNullable<VariantProps<typeof tabsTriggerVariants>["size"]>;

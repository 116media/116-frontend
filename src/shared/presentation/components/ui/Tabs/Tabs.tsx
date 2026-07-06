"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import {
    type ComponentPropsWithoutRef,
    type ComponentRef,
    createContext,
    forwardRef,
    useEffect,
    useId,
    useRef,
    useState
} from "react";

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

export type TabsSize = NonNullable<VariantProps<typeof tabsTriggerVariants>["size"]>;

/**
 * The size inherited by every `TabsList` / `TabsTrigger` from the `Tabs` root,
 * overridable per component.
 */
export const TabsSizeContext = createContext<TabsSize>("sm");

/**
 * The travel direction of the last tab change: 1 when moving to a later tab
 * (content slides in from the right), -1 when moving to an earlier one
 * (slides in from the left).
 */
export const TabsDirectionContext = createContext(1);

/**
 * The mount-ordered list of trigger values, registered by each `TabsTrigger`,
 * used to compute the travel direction between two values.
 */
export const TabsOrderContext = createContext<{ current: string[] } | null>(null);

/**
 * The active trigger value plus a per-root `layoutId`, so each `TabsTrigger`
 * can render the shared sliding indicator (a single `motion.span` that springs
 * from one trigger to the next) only when it is the active tab.
 */
export const TabsActiveContext = createContext<{
    activeValue: string | undefined;
    layoutId: string;
}>({
    activeValue: undefined,
    layoutId: "tabs-indicator"
});

export const TAB_SPRING = { type: "spring", stiffness: 400, damping: 32 } as const;

/**
 * Props for the {@link Tabs} root.
 *
 * @interface TabsProps
 * @property {TabsSize} [size] - The size inherited by every list and trigger. Defaults to "sm".
 */
export interface TabsProps extends ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
    size?: TabsSize;
}

/**
 * Tabs
 *
 * @description
 * The tabs root — Radix `Tabs.Root` (roving focus, arrow keys, `aria-selected`
 * all intact) extended with a motion layer: it tracks the order triggers mount
 * in, derives the travel direction of every value change, and exposes both —
 * plus the size and a per-root `layoutId` — through context, so each
 * `TabsTrigger` can slide its shared active pill and each `TabsContent` can
 * slide in from the correct side. Works controlled (`value` + `onValueChange`)
 * and uncontrolled (`defaultValue`).
 *
 * @param size - The size inherited by every list and trigger. Defaults to "sm".
 * @param value - The controlled active value.
 * @param defaultValue - The uncontrolled initial value.
 * @param onValueChange - Change callback, forwarded after the direction updates.
 */
export const Tabs = forwardRef<ComponentRef<typeof TabsPrimitive.Root>, TabsProps>(
    ({ size = "sm", value, defaultValue, onValueChange, children, ...props }, ref) => {
        const layoutId = useId();
        const order = useRef<string[]>([]);
        const previous = useRef<string | undefined>(value ?? defaultValue);
        const [direction, setDirection] = useState(1);
        const [activeValue, setActiveValue] = useState<string | undefined>(value ?? defaultValue);

        // Keep the tracked active value in step with a controlled `value` prop,
        // so the sliding indicator follows programmatic changes, not just clicks.
        useEffect(() => {
            if (value !== undefined) setActiveValue(value);
        }, [value]);

        const handleValueChange = (next: string) => {
            const previousIndex = order.current.indexOf(previous.current ?? "");
            const nextIndex = order.current.indexOf(next);
            setDirection(nextIndex >= previousIndex ? 1 : -1);
            previous.current = next;
            setActiveValue(next);
            onValueChange?.(next);
        };

        return (
            <TabsPrimitive.Root
                ref={ref}
                value={value}
                defaultValue={defaultValue}
                onValueChange={handleValueChange}
                {...props}
            >
                <TabsSizeContext.Provider value={size}>
                    <TabsOrderContext.Provider value={order}>
                        <TabsActiveContext.Provider value={{ activeValue, layoutId }}>
                            <TabsDirectionContext.Provider value={direction}>
                                {children}
                            </TabsDirectionContext.Provider>
                        </TabsActiveContext.Provider>
                    </TabsOrderContext.Provider>
                </TabsSizeContext.Provider>
            </TabsPrimitive.Root>
        );
    }
);
Tabs.displayName = "Tabs";

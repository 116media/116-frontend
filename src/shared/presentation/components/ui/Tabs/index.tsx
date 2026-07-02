"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "motion/react";
import {
    type ComponentPropsWithoutRef,
    type ComponentRef,
    createContext,
    forwardRef,
    useContext,
    useEffect,
    useRef,
    useState
} from "react";

import { cn } from "@/shared/presentation/utils/cn";

/**
 * The travel direction of the last tab change: 1 when moving to a later tab
 * (content slides in from the right), -1 when moving to an earlier one
 * (slides in from the left).
 */
const TabsDirectionContext = createContext(1);

/**
 * The mount-ordered list of trigger values, registered by each TabsTrigger,
 * used to compute the travel direction between two values.
 */
const TabsOrderContext = createContext<{ current: string[] } | null>(null);

/**
 * Tabs
 *
 * @description
 * The tabs root — Radix `Tabs.Root` (roving focus, arrow keys,
 * `aria-selected` all intact) extended with a motion layer: it tracks the
 * order triggers mount in, derives the travel direction of every value
 * change, and exposes it through context so each `TabsContent` can slide in
 * from the correct side. Works controlled (`value` + `onValueChange`) and
 * uncontrolled (`defaultValue`).
 *
 * @param value - The controlled active value.
 * @param defaultValue - The uncontrolled initial value.
 * @param onValueChange - Change callback, forwarded after the direction updates.
 */
export const Tabs = forwardRef<
    ComponentRef<typeof TabsPrimitive.Root>,
    ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ value, defaultValue, onValueChange, children, ...props }, ref) => {
    const order = useRef<string[]>([]);
    const previous = useRef<string | undefined>(value ?? defaultValue);
    const [direction, setDirection] = useState(1);

    const handleValueChange = (next: string) => {
        const previousIndex = order.current.indexOf(previous.current ?? "");
        const nextIndex = order.current.indexOf(next);
        setDirection(nextIndex >= previousIndex ? 1 : -1);
        previous.current = next;
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
            <TabsOrderContext.Provider value={order}>
                <TabsDirectionContext.Provider value={direction}>
                    {children}
                </TabsDirectionContext.Provider>
            </TabsOrderContext.Provider>
        </TabsPrimitive.Root>
    );
});
Tabs.displayName = "Tabs";

/**
 * TabsList
 *
 * @description
 * The trigger strip: an inline muted pill container in the shadcn anatomy.
 * `className` is merged last so surfaces can override per usage.
 */
export const TabsList = forwardRef<
    ComponentRef<typeof TabsPrimitive.List>,
    ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn(
            "inline-flex items-center gap-1 rounded-lg bg-muted p-1 text-muted-foreground",
            className
        )}
        {...props}
    />
));
TabsList.displayName = "TabsList";

/**
 * TabsTrigger
 *
 * @description
 * One tab button in the shadcn anatomy: muted at rest, lifted onto the
 * background surface with a soft shadow when active. Registers its value in
 * the root's mount-ordered list so the motion layer can tell which way the
 * content should travel.
 *
 * @param value - The tab value this trigger activates.
 */
export const TabsTrigger = forwardRef<
    ComponentRef<typeof TabsPrimitive.Trigger>,
    ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, value, ...props }, ref) => {
    const order = useContext(TabsOrderContext);

    useEffect(() => {
        if (order && !order.current.includes(value)) order.current.push(value);
    }, [order, value]);

    return (
        <TabsPrimitive.Trigger
            ref={ref}
            value={value}
            className={cn(
                "rounded-md px-3 py-1.5 font-medium text-sm transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
                "disabled:pointer-events-none disabled:opacity-50",
                className
            )}
            {...props}
        />
    );
});
TabsTrigger.displayName = "TabsTrigger";

/**
 * Props for TabsContent — the Radix content props plus the motion opt-out.
 *
 * @interface TabsContentProps
 * @property {boolean} [animated] - Wraps children in the direction-aware
 * slide+fade mount animation. Defaults to true.
 */
export interface TabsContentProps extends ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {
    animated?: boolean;
}

/**
 * TabsContent
 *
 * @description
 * One tab panel. Radix unmounts inactive content, so the mount animation is
 * the transition: a direction-aware slide+fade (in from the right when moving
 * to a later tab, from the left when moving back) driven by the root's
 * direction context. Set `animated={false}` for consumers that don't want
 * motion.
 *
 * @param animated - Whether to run the mount animation. Defaults to true.
 */
export const TabsContent = forwardRef<ComponentRef<typeof TabsPrimitive.Content>, TabsContentProps>(
    ({ className, animated = true, children, ...props }, ref) => {
        const direction = useContext(TabsDirectionContext);

        return (
            <TabsPrimitive.Content
                ref={ref}
                className={cn("mt-4 focus-visible:outline-none", className)}
                {...props}
            >
                {animated ? (
                    <motion.div
                        initial={{ opacity: 0, x: direction * 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        {children}
                    </motion.div>
                ) : (
                    children
                )}
            </TabsPrimitive.Content>
        );
    }
);
TabsContent.displayName = "TabsContent";

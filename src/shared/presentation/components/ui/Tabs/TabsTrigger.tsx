"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "motion/react";
import {
    type ComponentPropsWithoutRef,
    type ComponentRef,
    forwardRef,
    useContext,
    useEffect
} from "react";

import { cn } from "@/shared/presentation/utils/cn";

import {
    TAB_SPRING,
    TabsActiveContext,
    TabsOrderContext,
    type TabsSize,
    TabsSizeContext,
    tabsTriggerVariants
} from "./Tabs";

/**
 * Props for the {@link TabsTrigger}.
 *
 * @interface TabsTriggerProps
 * @property {TabsSize} [size] - Overrides the size inherited from the `Tabs` root.
 */
export interface TabsTriggerProps extends ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
    size?: TabsSize;
}

/**
 * TabsTrigger
 *
 * @description
 * One tab button in the shadcn anatomy: muted at rest, lifted onto the
 * background surface when active. The active fill is a single shared
 * `motion.span` (keyed by the root's `layoutId`) rendered only inside the
 * active trigger, so switching tabs springs the pill from the old trigger to
 * the new one — the label sits above it on its own layer. Registers its value
 * in the root's mount-ordered list so the content layer can tell which way to
 * travel. Sizing follows `size` (inherited from the `Tabs` root, or overridden
 * here).
 *
 * @param size - Overrides the size inherited from the `Tabs` root.
 * @param value - The tab value this trigger activates.
 */
export const TabsTrigger = forwardRef<ComponentRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(
    ({ className, size, value, children, ...props }, ref) => {
        const order = useContext(TabsOrderContext);
        const inherited = useContext(TabsSizeContext);
        const { activeValue, layoutId } = useContext(TabsActiveContext);
        const isActive = activeValue === value;

        useEffect(() => {
            if (order && !order.current.includes(value)) order.current.push(value);
        }, [order, value]);

        return (
            <TabsPrimitive.Trigger
                ref={ref}
                value={value}
                className={cn(tabsTriggerVariants({ size: size ?? inherited }), className)}
                {...props}
            >
                {isActive && (
                    <motion.span
                        layoutId={layoutId}
                        transition={TAB_SPRING}
                        className="absolute inset-0 rounded-md bg-background"
                    />
                )}
                <span className="relative z-10">{children}</span>
            </TabsPrimitive.Trigger>
        );
    }
);
TabsTrigger.displayName = "TabsTrigger";

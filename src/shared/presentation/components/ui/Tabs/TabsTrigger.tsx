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

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

import { TAB_SPRING, TabsActiveContext, TabsOrderContext, TabsSizeContext } from "./tabsContext";
import { type TabsSize, tabsTriggerVariants } from "./tabsVariants";

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
 * One tab button in the shadcn anatomy: muted at rest, lifted onto the background
 * surface when active. A shared `motion.span` springs the active pill between
 * triggers; each trigger registers its value so the content layer knows the direction.
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

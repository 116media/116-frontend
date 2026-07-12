"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "motion/react";
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef, useContext } from "react";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

import { TabsDirectionContext } from "./tabsContext";

/**
 * Props for the {@link TabsContent}.
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
 * One tab panel. Radix unmounts inactive content, so the mount animation is the
 * transition: a direction-aware slide+fade driven by the root's direction context.
 * Set `animated={false}` for consumers that don't want motion.
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
                        animate={{ opacity: 1, x: 0 }}
                        initial={{ opacity: 0, x: direction * 24 }}
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

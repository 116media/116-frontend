"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef, useContext } from "react";

import { cn } from "@/shared/presentation/utils/cn";

import { type TabsSize, TabsSizeContext, tabsListVariants } from "./Tabs";

/**
 * Props for the {@link TabsList}.
 *
 * @interface TabsListProps
 * @property {TabsSize} [size] - Overrides the size inherited from the `Tabs` root.
 */
export interface TabsListProps extends ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
    size?: TabsSize;
}

/**
 * TabsList
 *
 * @description
 * The trigger strip: an inline muted pill container in the shadcn anatomy.
 * Padding scales with `size` (inherited from the `Tabs` root, or overridden
 * here); `className` is merged last so surfaces can override per usage.
 *
 * @param size - Overrides the size inherited from the `Tabs` root.
 */
export const TabsList = forwardRef<ComponentRef<typeof TabsPrimitive.List>, TabsListProps>(
    ({ className, size, ...props }, ref) => {
        const inherited = useContext(TabsSizeContext);
        return (
            <TabsPrimitive.List
                ref={ref}
                className={cn(tabsListVariants({ size: size ?? inherited }), className)}
                {...props}
            />
        );
    }
);
TabsList.displayName = "TabsList";

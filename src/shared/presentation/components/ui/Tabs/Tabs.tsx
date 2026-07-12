"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import {
    type ComponentPropsWithoutRef,
    type ComponentRef,
    forwardRef,
    useEffect,
    useId,
    useRef,
    useState
} from "react";

import {
    TabsActiveContext,
    TabsDirectionContext,
    TabsOrderContext,
    TabsSizeContext
} from "./tabsContext";
import type { TabsSize } from "./tabsVariants";

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
 * The tabs root — Radix `Tabs.Root` extended with a motion layer: tracks trigger
 * mount order and each change's travel direction, exposing both through context for
 * the sliding indicator and content transitions. Works controlled and uncontrolled.
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

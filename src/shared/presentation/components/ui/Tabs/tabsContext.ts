"use client";

import { createContext } from "react";

import type { TabsSize } from "./tabsVariants";

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

/**
 * The spring used by the sliding active-tab indicator and content transitions.
 */
export const TAB_SPRING = { type: "spring", stiffness: 400, damping: 32 } as const;

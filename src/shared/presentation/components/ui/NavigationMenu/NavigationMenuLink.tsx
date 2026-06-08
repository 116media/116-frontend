"use client";

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";

/**
 * NavigationMenuLink
 *
 * @description
 * An accessible link element inside the navigation menu.
 * Use with asChild and next/link to keep the router integration:
 *
 * @example
 * ```tsx
 * <NavigationMenuLink asChild>
 *   <Link href="/articles">NEWS</Link>
 * </NavigationMenuLink>
 * ```
 */
export const NavigationMenuLink = NavigationMenuPrimitive.Link;

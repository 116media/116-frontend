# NavigationMenu UI Primitive

## Overview

The mega menu is built on `@radix-ui/react-navigation-menu` — the Radix UI primitive designed specifically for site navigation with hover-triggered submenus. It provides hover handling, keyboard navigation (Tab, arrow keys, Escape), focus management, and ARIA roles out of the box.

The NavigationMenu primitive follows the same shadcn/ui pattern already used for `Button` and `DropdownMenu` in this project: Radix provides the behavior, Tailwind provides the styling, and all colors come from `theme.css` tokens.

## Installation

```bash
yarn add @radix-ui/react-navigation-menu
```

## Component Structure

```text
src/shared/presentation/components/ui/NavigationMenu/
  NavigationMenu.tsx          ← Root wrapper
  NavigationMenuList.tsx      ← Horizontal list of items
  NavigationMenuItem.tsx      ← Individual nav item
  NavigationMenuTrigger.tsx   ← Hover trigger (styled like a nav link)
  NavigationMenuContent.tsx   ← Panel that appears on hover
  NavigationMenuLink.tsx      ← Plain nav link (no panel)
  NavigationMenuViewport.tsx  ← Shared panel host below the trigger bar
  index.ts                    ← Barrel export
```

One file per component, following the same convention as `DropdownMenu/`.

## Components

### NavigationMenu

```typescript
// src/shared/presentation/components/ui/NavigationMenu/NavigationMenu.tsx
"use client";

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import type { ComponentPropsWithoutRef, ComponentRef } from "react";
import { forwardRef } from "react";
import { cn } from "@/shared/presentation/utils/cn";

/**
 * NavigationMenu
 *
 * @description
 * Root provider for the navigation menu. Manages open/close state across all items.
 * Wrap NavigationMenuList inside this.
 */
export const NavigationMenu = forwardRef<
    ComponentRef<typeof NavigationMenuPrimitive.Root>,
    ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
    <NavigationMenuPrimitive.Root
        ref={ref}
        className={cn("relative flex items-center", className)}
        {...props}
    >
        {children}
    </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;
```

### NavigationMenuList

```typescript
// src/shared/presentation/components/ui/NavigationMenu/NavigationMenuList.tsx
"use client";

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import type { ComponentPropsWithoutRef, ComponentRef } from "react";
import { forwardRef } from "react";
import { cn } from "@/shared/presentation/utils/cn";

/**
 * NavigationMenuList
 *
 * @description
 * The horizontal list of navigation items. Renders as a flex row.
 */
export const NavigationMenuList = forwardRef<
    ComponentRef<typeof NavigationMenuPrimitive.List>,
    ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
    <NavigationMenuPrimitive.List
        ref={ref}
        className={cn("flex items-center gap-1", className)}
        {...props}
    />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;
```

### NavigationMenuItem

```typescript
// src/shared/presentation/components/ui/NavigationMenu/NavigationMenuItem.tsx
"use client";

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";

/**
 * NavigationMenuItem
 *
 * @description
 * A single item in the navigation menu. Wraps either a trigger+content
 * pair (for mega menu items) or a plain NavigationMenuLink.
 */
export const NavigationMenuItem = NavigationMenuPrimitive.Item;
```

### NavigationMenuTrigger

The trigger visually matches the plain nav links in `DesktopNav`. The `data-[state=open]` attribute rotates the chevron to signal the open state.

```typescript
// src/shared/presentation/components/ui/NavigationMenu/NavigationMenuTrigger.tsx
"use client";

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { ChevronDown } from "lucide-react";
import type { ComponentPropsWithoutRef, ComponentRef } from "react";
import { forwardRef } from "react";
import { cn } from "@/shared/presentation/utils/cn";

/**
 * NavigationMenuTrigger
 *
 * @description
 * Hover/focus trigger for a mega menu item. Styled to match plain nav links.
 * The ChevronDown icon rotates when the panel is open.
 */
export const NavigationMenuTrigger = forwardRef<
    ComponentRef<typeof NavigationMenuPrimitive.Trigger>,
    ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <NavigationMenuPrimitive.Trigger
        ref={ref}
        className={cn(
            "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            className
        )}
        {...props}
    >
        {children}
        <ChevronDown
            size={14}
            className="shrink-0 text-muted-foreground transition-transform duration-200 data-[state=open]:rotate-180"
            aria-hidden="true"
        />
    </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;
```

### NavigationMenuContent

The panel that slides down from the trigger. Positioned absolutely relative to the viewport host.

```typescript
// src/shared/presentation/components/ui/NavigationMenu/NavigationMenuContent.tsx
"use client";

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import type { ComponentPropsWithoutRef, ComponentRef } from "react";
import { forwardRef } from "react";
import { cn } from "@/shared/presentation/utils/cn";

/**
 * NavigationMenuContent
 *
 * @description
 * The mega menu panel rendered inside the NavigationMenuViewport.
 * Uses theme tokens for background, border, and shadow.
 * Enter/exit animations are driven by Radix data attributes.
 */
export const NavigationMenuContent = forwardRef<
    ComponentRef<typeof NavigationMenuPrimitive.Content>,
    ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
    <NavigationMenuPrimitive.Content
        ref={ref}
        className={cn(
            "w-full",
            "data-[motion=from-start]:animate-in data-[motion=from-start]:fade-in data-[motion=from-start]:slide-in-from-left-5",
            "data-[motion=from-end]:animate-in data-[motion=from-end]:fade-in data-[motion=from-end]:slide-in-from-right-5",
            "data-[motion=to-start]:animate-out data-[motion=to-start]:fade-out data-[motion=to-start]:slide-out-to-left-5",
            "data-[motion=to-end]:animate-out data-[motion=to-end]:fade-out data-[motion=to-end]:slide-out-to-right-5",
            className
        )}
        {...props}
    />
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;
```

### NavigationMenuLink

Used for plain nav items (LYRICS, ARTISTES) that have no panel.

```typescript
// src/shared/presentation/components/ui/NavigationMenu/NavigationMenuLink.tsx
"use client";

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cn } from "@/shared/presentation/utils/cn";

/**
 * NavigationMenuLink
 *
 * @description
 * A plain navigable link inside the navigation menu, without a sub-panel.
 * Pass asChild and a next/link inside to keep client-side routing.
 */
export function NavigationMenuLink({
    className,
    ...props
}: React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link>) {
    return (
        <NavigationMenuPrimitive.Link
            className={cn(
                "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                className
            )}
            {...props}
        />
    );
}
```

### NavigationMenuViewport

The shared container that hosts the active panel. Positioned absolutely below the navigation bar.

```typescript
// src/shared/presentation/components/ui/NavigationMenu/NavigationMenuViewport.tsx
"use client";

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import type { ComponentPropsWithoutRef, ComponentRef } from "react";
import { forwardRef } from "react";
import { cn } from "@/shared/presentation/utils/cn";

/**
 * NavigationMenuViewport
 *
 * @description
 * The viewport that hosts the active NavigationMenuContent panel.
 * Positioned absolutely below the navigation triggers. All panels
 * transition through this single shared host.
 */
export const NavigationMenuViewport = forwardRef<
    ComponentRef<typeof NavigationMenuPrimitive.Viewport>,
    ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
    <div className="absolute left-0 top-full w-full">
        <NavigationMenuPrimitive.Viewport
            ref={ref}
            className={cn(
                "w-full overflow-hidden rounded-b-md border border-border bg-popover shadow-lg",
                "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
                "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
                className
            )}
            {...props}
        />
    </div>
));
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;
```

### index.ts (barrel export)

```typescript
// src/shared/presentation/components/ui/NavigationMenu/index.ts
export { NavigationMenu } from "./NavigationMenu";
export { NavigationMenuList } from "./NavigationMenuList";
export { NavigationMenuItem } from "./NavigationMenuItem";
export { NavigationMenuTrigger } from "./NavigationMenuTrigger";
export { NavigationMenuContent } from "./NavigationMenuContent";
export { NavigationMenuLink } from "./NavigationMenuLink";
export { NavigationMenuViewport } from "./NavigationMenuViewport";
```

## Keyboard Behavior

Radix handles all of this automatically:

| Key | Behavior |
| --- | --- |
| Tab / Shift+Tab | Move focus between triggers and plain links |
| Enter / Space | Open the panel for the focused trigger |
| Arrow keys | Navigate between items and inside the panel |
| Escape | Close the open panel |
| Home / End | Jump to first / last item |

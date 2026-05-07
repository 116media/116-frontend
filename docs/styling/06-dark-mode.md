# Dark Mode

## Strategy

Use the `class` strategy with `next-themes`. By default, the site follows the user's OS setting (`prefers-color-scheme`). If the OS is in dark mode, the site is in dark mode automatically. The user can also override this manually via a theme toggle, and that preference is saved in `localStorage` for future visits. The `class` strategy is needed because it lets `next-themes` control the `dark` class on `<html>`, which is how both the OS default and manual override work together.

## How It Works

1. The root `<html>` element gets a `dark` class when dark mode is active
2. CSS variables swap values inside the `.dark` selector (defined in globals.css)
3. All Tailwind classes automatically adapt because they reference CSS variables

```css
:root {
    --background: 255 255 255;
    --foreground: 23 23 23;
}

.dark {
    --background: 10 10 10;
    --foreground: 250 250 250;
}
```

## Theme Provider

Use `next-themes` for dark mode management. It handles:

- Reading user preference from localStorage
- Falling back to system preference
- Preventing flash of wrong theme (FOUC)
- Syncing the `dark` class on `<html>`

```typescript
// src/shared/presentation/providers/ThemeProvider.tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </NextThemesProvider>
    );
}
```

## Toggle Component

```typescript
"use client";

import { useTheme } from "next-themes";
import { Button } from "@/shared/presentation/components/ui/button";
import { SunIcon, MoonIcon } from "lucide-react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Changer le thème"
        >
            <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
    );
}
```

## Preventing Flash

Add `suppressHydrationWarning` to the `<html>` element because `next-themes` modifies the class before React hydrates:

```typescript
<html lang="fr" className={outfit.variable} suppressHydrationWarning>
```

## Testing

Always test both themes. Common issues:

- Images with transparent backgrounds that look fine on white but invisible on dark
- Box shadows that are too subtle on dark backgrounds
- Border colors that blend into the dark background
- Text contrast that passes in light mode but fails in dark mode

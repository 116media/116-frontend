# Layout System

## Overview

The layout system uses Next.js App Router's nested layout feature. Each route group has its own layout that wraps all pages within it.

## Layout Hierarchy

```text
app/layout.tsx (Root)
  Providers (Theme, Query, Auth, AuthDialog)
  Font loading
  Global metadata
  Auth modals (login, signup, forgot password, etc.)
  
  app/(public)/layout.tsx
    TopBar (social follow bar — gradient)
    Header (logo, navigation, mega menu, search, auth buttons)
    Main content area
    Footer (links, social, copyright)
    
  app/(user)/layout.tsx
    TopBar
    Header
    Sidebar (profile, playlists, bookmarks, favorites, settings)
    Main content area
    Footer
```

There is no `(auth)` layout. All auth forms are modals rendered at the root layout level via `AuthDialogProvider`. This means the login modal can appear on any page without navigating away.

## Root Layout

The root layout wraps everything. It sets up providers, fonts, and global metadata.

```typescript
// app/layout.tsx
import { Outfit } from "next/font/google";
import { ThemeProvider } from "@/shared/presentation/providers/ThemeProvider";
import { QueryProvider } from "@/shared/presentation/providers/QueryProvider";
import { AuthProvider } from "@/shared/presentation/providers/AuthProvider";
import "@/shared/presentation/styles/globals.css";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});

export const metadata = {
    title: {
        template: "%s | 116",
        default: "116 - Musique & Culture Hip-Hop",
    },
    description: "Articles, vidéos et paroles de la culture hip-hop en RDC et au-delà.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();

    return (
        <html lang="fr" className={outfit.variable} suppressHydrationWarning>
            <body className="bg-background text-foreground antialiased">
                <ThemeProvider>
                    <QueryProvider>
                        <AuthProvider user={user}>
                            <AuthDialogProvider>
                                {children}
                                <AuthModals />
                            </AuthDialogProvider>
                        </AuthProvider>
                    </QueryProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
```

## Public Layout

The public layout renders the top bar, main header, and footer around the page content.

```typescript
// app/(public)/layout.tsx
import { TopBar } from "@/shared/presentation/layouts/TopBar";
import { Header } from "@/shared/presentation/layouts/Header";
import { Footer } from "@/shared/presentation/layouts/Footer";

export default async function PublicLayout({ children }) {
    const [categories, promotedArticles, promotedVideos] = await Promise.all([
        fetchActiveCategories(),
        fetchPromotedArticles(),
        fetchPromotedVideos(),
    ]);

    return (
        <>
            <TopBar />
            <Header
                categories={categories}
                promotedArticles={promotedArticles}
                promotedVideos={promotedVideos}
            />
            <main className="min-h-screen">{children}</main>
            <Footer />
        </>
    );
}
```

The categories and promoted content are fetched once at the layout level (Server Component) and passed as props. This avoids client-side fetching for navigation data.

---

## TopBar Component

The top bar sits above the main header on every public page. It is purely presentational — no auth state, no interactivity beyond the external social links.

### Layout

```text
+-----------------------------------------------------------------------+
|            Nous suivre   [YT]  [IG]  [FB]  [TT]  [TW]               |
+-----------------------------------------------------------------------+
```

- Centered content: the text "Nous suivre" followed immediately by five social icons on the same line
- Social icons (in order): YouTube, Instagram, Facebook, TikTok, Twitter/X
- Each icon links to the platform's official 116 Media account and opens in a new tab (`target="_blank" rel="noopener noreferrer"`)
- Background: horizontal gradient from `var(--brand-primary)` (#490fd2) on the left to `var(--brand-secondary)` (#ff74d4) on the right
- Text and icons: white, slightly smaller than body text (e.g., `text-sm`)
- Height: compact — `py-2` is sufficient

### Implementation

```typescript
// shared/presentation/layouts/TopBar/index.tsx
import { Youtube, Instagram, Facebook } from "lucide-react";
import { SiTiktok, SiX } from "@icons-pack/react-simple-icons";

const SOCIAL_LINKS = [
    { icon: Youtube, href: "https://youtube.com/@116media", label: "YouTube" },
    { icon: Instagram, href: "https://instagram.com/116media", label: "Instagram" },
    { icon: Facebook, href: "https://facebook.com/116media", label: "Facebook" },
    { icon: SiTiktok, href: "https://tiktok.com/@116media", label: "TikTok" },
    { icon: SiX, href: "https://x.com/116media", label: "Twitter / X" },
];

export function TopBar() {
    return (
        <div
            className="w-full py-2 text-white text-sm"
            style={{
                background: "linear-gradient(to right, var(--brand-primary), var(--brand-secondary))",
            }}
        >
            <div className="flex items-center justify-center gap-3">
                <span className="font-medium">Nous suivre</span>
                {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                    <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="opacity-90 hover:opacity-100 transition-opacity"
                    >
                        <Icon size={16} />
                    </a>
                ))}
            </div>
        </div>
    );
}
```

`TopBar` is a Server Component. It has no client-side state.

---

## Header Component

The main header sits directly below the `TopBar`. It handles navigation, search, and auth.

### Desktop Layout

```text
+-----------------------------------------------------------------------+
|  [Logo]   Articles ▾   Vidéos ▾   Paroles   Artistes   [🔍] [Avatar] |
+-----------------------------------------------------------------------+
```

- **Left**: Site logo linking to `/`
- **Center**: Primary nav — Articles, Vidéos, Paroles, Artistes
- **Right**: Search icon + `UserAccountControl` (shows "Se connecter" button for anonymous visitors, or a user avatar for authenticated users) + theme toggle
- Background: white in light mode, dark surface in dark mode — `bg-background`
- Sticky on scroll with backdrop blur: `sticky top-0 z-40 bg-background/80 backdrop-blur-lg`
- The active route link is highlighted

**Réels does not appear in the navbar.** The Réels / Shorts feed is surfaced on the home/feed screen. It is not a standalone navigation destination.

Only **Articles** and **Vidéos** trigger a mega menu on hover. **Paroles** and **Artistes** are plain links.

### UserAccountControl (right side)

A single adaptive component that renders differently based on auth state:

- **Anonymous**: an outline `"Se connecter"` button that will call `openAuth("LOGIN")` from `useAuthDialog()` to open the login modal. No page navigation occurs.
- **Authenticated**: a circular avatar showing the user's profile picture, or initials derived from the username as a fallback (with a deterministic brand color), or a `UserRound` icon as the ultimate fallback.

There is no separate "S'inscrire" button in the header. New users sign up through the login modal flow.

### Desktop: Mega Menu

When the user hovers over "Articles" or "Vidéos", a mega menu panel drops down:

```text
+-----------------------------------------------------------------------+
|  [Logo]   Articles ▾   Vidéos ▾   Paroles   Artistes   [🔍] [Avatar] |
+-----------------------------------------------------------------------+
|                                                                       |
|  CATÉGORIES             À LA UNE                    TAGS POPULAIRES   |
|                                                                       |
|  Artist Profile  >      +------------------+        [Fally Ipupa]     |
|  Chronique Sale  >      | [Promoted Image] |        [Kinshasa]        |
|  116 Le Focus    >      | Article Title    |        [Afrobeats]       |
|  116 Interview   >      | Author - 3 min   |        [Rumba]           |
|  FlexBeat        >      +------------------+        [Innoss'B]        |
|  BTS             >                                                    |
|  Podcast         >      +------------------+                          |
|                         | [Promoted Image] |        VOIR TOUT ->      |
|                         | Article Title    |                          |
|                         +------------------+                          |
|                                                                       |
+-----------------------------------------------------------------------+
```

The panel has three columns:

1. **Categories** (left): Active categories for the content type, each linking to a filtered view (e.g., `/articles?category=artist-profile`). Data from `GET /api/v1/public/categories` filtered by content type.

2. **Promoted content** (center): 2 promoted content cards with thumbnail, title, author, and read time. Data from `GET /api/v1/public/articles/promoted` or `GET /api/v1/public/videos/promoted`.

3. **Trending tags** (right): Most-used tags as clickable chips. Data from `GET /api/v1/public/tags`. Clicking filters the content list by tag.

**Behavior:**

- Opens on hover with a 150ms delay to prevent accidental triggers
- Stays open while the mouse is inside the panel
- Closes when the mouse leaves or the user clicks a link
- Animation: fade-in + slide-down (200ms ease-out)

### Mobile: Slide-in Drawer

```text
+------------------------------+
| [≡]   [Logo]          [🔍]  |
+------------------------------+
```

The hamburger icon opens a full-height drawer from the left:

```text
+---------------------------+
| [X]               [Logo]  |
+---------------------------+
| [Avatar] Username         |
| Voir mon profil ->        |
+---------------------------+
| 🔍 Rechercher...          |
|                           |
| ▼ Articles                |
|   Artist Profile          |
|   Chronique Sale          |
|   [thumb] Article Title   |
|   [thumb] Article Title   |
|                           |
| ▼ Vidéos                  |
|   116 Le Focus            |
|   FlexBeat                |
|   [thumb] Video Title     |
|   [thumb] Video Title     |
|                           |
| Paroles                   |
| Artistes                  |
|                           |
+---------------------------+
| [🌙 Thème]                |
+---------------------------+
```

1. **User section** (top): Avatar + username + profile link if authenticated; "Se connecter" button if anonymous.
2. **Search bar**: Always visible.
3. **Articles and Vidéos as accordions**: Expand to show categories + 2 promoted cards + "Voir tout" link.
4. **Paroles and Artistes**: Plain links.
5. **Footer** (bottom): Theme toggle.

**Behavior:**

- Slide animation from left (300ms ease-out)
- Semi-transparent backdrop
- Swipe right to dismiss
- Width: 85vw, capped at 380px
- Body scroll locked while open
- Uses shadcn `Sheet` (Radix Dialog) for accessibility: focus trap, Escape to close, ARIA roles

### Component Structure

```text
shared/presentation/layouts/
  TopBar/
    index.tsx                    # Gradient social follow bar (Server Component)
  Header/
    index.tsx                    # Sticky wrapper — switches between desktop/mobile
    DesktopNav.tsx               # Horizontal nav links + mega menu triggers
    MegaMenuPanel.tsx            # Dropdown panel (Articles / Vidéos)
    MegaMenuCategories.tsx       # Category links column
    MegaMenuPromoted.tsx         # Promoted content cards column
    MegaMenuTags.tsx             # Trending tags column
    MobileDrawer.tsx             # Slide-in drawer (shadcn Sheet)
    MobileDrawerAccordion.tsx    # Collapsible section per content type
    MobileDrawerPromoted.tsx     # Compact promoted cards for drawer
    SearchOverlay.tsx            # Full-screen search on mobile
    UserMenu.tsx                 # Avatar dropdown (desktop) / user section (drawer)
shared/presentation/components/
  ui/                            # shadcn primitives (Button, Input, etc.)
  common/
    ThemeToggle/                 # Animated sun/moon theme switcher
    UserAccountControl/          # "Se connecter" button or user avatar (auth-adaptive)
```

---

## Footer Component

```text
+-----------------------------------------------------------------------+
|                                                                       |
|                            [Logo]                                     |
|                                                                       |
|   ARTICLES          VIDÉOS            RÉELS          PAROLES          |
|   Artist Profile    116 Le Focus      Tous les       Rechercher       |
|   Chronique Sale    116 Interview     réels ->       par artiste ->   |
|   Voir tout ->      FlexBeat                                         |
|                     Voir tout ->                                      |
|                                                                       |
|   [Instagram] [Twitter/X] [YouTube] [TikTok] [Facebook]              |
|                                                                       |
|   © 2026 116 Media. Tous droits réservés.                            |
|                                                                       |
+-----------------------------------------------------------------------+
```

The footer mirrors the mega menu categories in a 4-column grid (2 columns on tablet, stacked on mobile), giving search engines additional internal links for crawling.

---

## User Layout

For authenticated user pages (profile, bookmarks, playlists, settings):

```typescript
// app/(user)/layout.tsx
import { TopBar } from "@/shared/presentation/layouts/TopBar";
import { Header } from "@/shared/presentation/layouts/Header";
import { UserSidebar } from "@/shared/presentation/layouts/UserSidebar";
import { Footer } from "@/shared/presentation/layouts/Footer";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <TopBar />
            <Header />
            <div className="mx-auto flex max-w-8xl gap-6 px-4 py-8">
                <UserSidebar className="hidden lg:block w-64 shrink-0" />
                <main className="min-w-0 flex-1">{children}</main>
            </div>
            <Footer />
        </>
    );
}
```

The sidebar is hidden on mobile. User pages are accessed through the avatar dropdown or a bottom navigation pattern.

---

## Page Containers

Each page uses a container for consistent max-width and padding:

```typescript
export function PageContainer({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 py-8", className)}>
            {children}
        </div>
    );
}
```

## Skeleton Layouts

Every page should have a `loading.tsx` that matches the layout structure to prevent layout shift during data loading.

```typescript
// app/(public)/articles/loading.tsx
export default function ArticlesLoading() {
    return (
        <PageContainer>
            <Skeleton className="h-10 w-48 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <ArticleCardSkeleton key={i} />
                ))}
            </div>
        </PageContainer>
    );
}
```

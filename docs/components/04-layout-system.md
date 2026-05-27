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
    Header (navigation, mega menu, search, auth buttons)
    Main content area
    Footer (links, social, copyright)
    
  app/(user)/layout.tsx
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

The public layout adds the header and footer. Most pages use this layout.

```typescript
// app/(public)/layout.tsx
import { Header } from "@/shared/presentation/layouts/Header";
import { Footer } from "@/shared/presentation/layouts/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
        </>
    );
}
```

## Header Component

The header is the most complex component in the layout. It has two completely different modes: a mega menu on desktop and a slide-in drawer on mobile.

### Global Header Behaviors

- Sticky on scroll with backdrop blur (`sticky top-0 z-50 bg-background/80 backdrop-blur-lg`)
- Auth state determines whether to show "Connexion" button or user avatar with dropdown
- Active route is highlighted in the nav
- Search opens a full-width overlay on mobile, inline input on desktop

### Desktop: Mega Menu

```text
+-----------------------------------------------------------------------+
|  [Logo]   Articles ▾   Vidéos ▾   Réels   Paroles   [Search] [Avatar]|
+-----------------------------------------------------------------------+
```

When the user hovers over "Articles" or "Vidéos", a mega menu panel drops down spanning most of the viewport width:

```text
+-----------------------------------------------------------------------+
|  [Logo]   Articles ▾   Vidéos ▾   Réels   Paroles   [Search] [Avatar]|
+-----------------------------------------------------------------------+
|                                                                       |
|  CATÉGORIES             A LA UNE                    TAGS POPULAIRES   |
|                                                                       |
|  Artist Profile  >      +------------------+        [Fally Ipupa]     |
|  Chronique Sale  >      | [Featured Image] |        [Kinshasa]        |
|  116 Le Focus    >      | Article Title    |        [Afrobeats]       |
|  116 Interview   >      | Author - 3 min   |        [Rumba]           |
|  FlexBeat        >      +------------------+        [Innoss'B]        |
|  BTS             >                                                    |
|  Podcast         >      +------------------+                          |
|                         | [Featured Image] |        VOIR TOUT ->      |
|                         | Article Title    |                          |
|                         +------------------+                          |
|                                                                       |
+-----------------------------------------------------------------------+
```

The mega menu panel has three columns:

1. **Categories column** (left): Lists active categories for the content type (Articles or Videos). Each category is a link to a filtered view (e.g., `/articles?category=artist-profile`). Categories come from the `GET /api/v1/public/categories` endpoint filtered by content type. The `IsFree` flag could be used to show a small badge on paid categories.

2. **Featured content column** (center): Shows 2 featured content cards with thumbnail images, title, author, and read time. These are pulled from the `GET /api/v1/public/articles/featured` or `GET /api/v1/public/videos/featured` endpoints. The `IsFeatured` + `FeaturedUntil` fields on the backend control what appears here. Cards link directly to the content detail page.

3. **Trending tags column** (right): Shows the most-used tags as clickable chips. Tags come from `GET /api/v1/public/tags`. Clicking a tag filters the content list by tag.

**Technical behavior:**

- Panel opens on hover with a small delay (150ms) to prevent accidental triggers
- Panel stays open while the mouse is inside it
- Panel closes when the mouse leaves or the user clicks a link
- Smooth animation: fade in + slide down (200ms ease-out)
- "Réels" and "Paroles" are direct links, no mega menu (they do not have subcategories)

### Mobile: Slide-in Drawer

```text
+---------+
| [≡] [Logo]          [🔍] |
+---------+
```

The hamburger icon (left side) opens a full-height drawer that slides in from the left:

```text
+---------------------------+
| [X Close]         [Logo]  |
+---------------------------+
| [Avatar] Nom d'utilisateur|
| Voir mon profil ->        |
+---------------------------+
|                           |
| 🔍 Rechercher...          |
|                           |
| ▼ Articles                |
|   Artist Profile          |
|   Chronique Sale          |
|                           |
|   [Featured thumb] Title  |
|   [Featured thumb] Title  |
|                           |
| ▼ Vidéos                  |
|   116 Le Focus            |
|   116 Music Video         |
|   116 Interview           |
|   FlexBeat                |
|   BTS                     |
|   Podcast                 |
|                           |
|   [Featured thumb] Title  |
|   [Featured thumb] Title  |
|                           |
| Réels                     |
| Paroles                   |
|                           |
+---------------------------+
| [🌙 Thème]  [📱 Langue]   |
+---------------------------+
```

The drawer replicates all the mega menu content in a vertical, mobile-friendly format:

1. **User section** (top): If authenticated, shows avatar + username with a link to profile. If not authenticated, shows "Connexion" and "Créer un compte" buttons.

2. **Search bar**: Always visible in the drawer, unlike desktop where it is in the header.

3. **Content sections as accordions**: "Articles" and "Vidéos" are collapsible sections. Tapping expands them to show:
   - Category links (same data as the mega menu categories column)
   - 2 featured content cards with compact thumbnails (same data as the mega menu featured column)
   - Each section has a "Voir tout" link at the bottom

4. **Direct links**: "Réels" and "Paroles" are simple links, not accordions.

5. **Footer actions** (bottom): Theme toggle (dark/light) and language selector if multilingual support is added later.

**Technical behavior:**

- Drawer opens with a slide animation from the left (300ms ease-out)
- Semi-transparent backdrop overlay behind the drawer
- Swipe right to dismiss gesture support
- Drawer width: 85% of viewport on mobile, capped at 380px
- Body scroll is locked while drawer is open
- Uses shadcn `Sheet` component (built on Radix Dialog) for accessibility: focus trap, escape to close, ARIA attributes

### Data Flow for Navigation

The categories and featured content displayed in the mega menu and drawer are fetched at the layout level and shared:

```typescript
// app/(public)/layout.tsx (Server Component)
export default async function PublicLayout({ children }) {
    const [categories, featuredArticles, featuredVideos] = await Promise.all([
        fetchActiveCategories(),
        fetchFeaturedArticles(),
        fetchFeaturedVideos(),
    ]);

    return (
        <>
            <Header
                categories={categories}
                featuredArticles={featuredArticles}
                featuredVideos={featuredVideos}
            />
            <main className="min-h-screen">{children}</main>
            <Footer />
        </>
    );
}
```

This ensures the mega menu data is server-rendered and does not require a client-side fetch. The data is fetched once per page load and passed as props.

### Component Structure

```text
shared/presentation/layouts/
  Header/
    index.tsx                   # Main header (switches between desktop/mobile)
    DesktopNav.tsx              # Desktop horizontal nav with mega menu triggers
    MegaMenuPanel.tsx           # The dropdown panel for Articles/Videos
    MegaMenuCategories.tsx      # Category links column
    MegaMenuFeatured.tsx        # Featured content cards column
    MegaMenuTags.tsx            # Trending tags column
    MobileDrawer.tsx            # The slide-in drawer (uses shadcn Sheet)
    MobileDrawerAccordion.tsx   # Collapsible content type section
    MobileDrawerFeatured.tsx    # Compact featured cards for drawer
    SearchOverlay.tsx           # Full-screen search on mobile
    UserMenu.tsx                # Avatar dropdown (desktop) / user section (drawer)
```

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

The footer mirrors the mega menu categories in a 4-column grid (collapses to 2 columns on tablet, stacked on mobile). This gives search engines additional internal links for crawling.

## User Layout

For authenticated user pages (profile, bookmarks, playlists, settings):

```typescript
// app/(user)/layout.tsx
import { Header } from "@/shared/presentation/layouts/Header";
import { UserSidebar } from "@/shared/presentation/layouts/UserSidebar";
import { Footer } from "@/shared/presentation/layouts/Footer";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8">
                <UserSidebar className="hidden lg:block w-64 shrink-0" />
                <main className="min-w-0 flex-1">{children}</main>
            </div>
            <Footer />
        </>
    );
}
```

The sidebar is hidden on mobile. On mobile, user pages are accessed through a profile dropdown or bottom navigation.

## Page Containers

Each page uses a container component that handles max-width and padding:

```typescript
export function PageContainer({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8", className)}>
            {children}
        </div>
    );
}
```

## Skeleton Layouts

Every page should have a `loading.tsx` that shows a skeleton matching the layout structure. This prevents layout shift during data loading.

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

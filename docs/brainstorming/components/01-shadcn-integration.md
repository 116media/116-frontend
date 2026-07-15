# shadcn/ui Integration

## What shadcn/ui Is

shadcn/ui is not a component library you install from npm. It is a collection of copy-paste components built on Radix UI primitives and styled with Tailwind CSS. You own the code. You can modify anything.

This is different from the dashboard which uses Ant Design (a traditional component library with its own theming system). The frontend uses shadcn because:

- It outputs actual files in your project (not hidden in node_modules)
- Components are styled with Tailwind classes (no CSS-in-JS, no separate theme config)
- Built on Radix UI which handles accessibility (keyboard nav, ARIA, focus management)
- No runtime CSS overhead
- Works with Server Components (Radix primitives are client-only, but the styled wrappers can be composed with server components)

## Setup

```bash
npx shadcn@latest init
```

The init wizard will ask:

- Style: Default
- Base color: Neutral (we override with 116 brand colors)
- CSS variables: Yes
- Tailwind config location: auto-detected
- Components location: `src/shared/presentation/components/ui`
- Utils location: `src/shared/presentation/utils`

This creates:

```text
src/shared/presentation/
  components/ui/
    button.tsx
    card.tsx
    ... (added as needed)
  utils/
    cn.ts              # className merge utility (clsx + tailwind-merge)
```

## Adding Components

Add components one at a time as you need them:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add input
npx shadcn@latest add skeleton
npx shadcn@latest add toast
npx shadcn@latest add avatar
npx shadcn@latest add badge
npx shadcn@latest add sheet          # Mobile slide-out menu
npx shadcn@latest add tabs
npx shadcn@latest add separator
npx shadcn@latest add scroll-area
```

Each command copies a component file into `src/shared/presentation/components/ui/`. You own it. Modify it to match the 116 brand.

## Components Likely Needed

| Component | Usage in 116 |
| --- | --- |
| `Button` | CTAs, like/bookmark/share, form submissions |
| `Card` | Article cards, video cards, short cards |
| `Dialog` | Login prompt, share modal, confirm actions |
| `DropdownMenu` | User menu, sort options |
| `Input` | Search, comment form, login form |
| `Sheet` | Mobile navigation drawer |
| `Skeleton` | Loading placeholders for cards, articles |
| `Avatar` | Author avatars, user profile |
| `Badge` | Category tags, promoted badge, status |
| `Tabs` | Content sections (articles/videos toggle) |
| `Toast` | Success/error notifications |
| `Separator` | Visual dividers between sections |
| `ScrollArea` | Horizontal scroll for promoted content |
| `AspectRatio` | Video thumbnails, cover images |
| `Pagination` | Article/video list pagination |

## Customizing for 116

After adding a component, modify it to use the 116 brand:

```typescript
// src/shared/presentation/components/ui/button.tsx
// The default shadcn button with 116 brand colors

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-brand-primary text-white hover:bg-brand-primary/90",
                secondary: "bg-brand-secondary text-white hover:bg-brand-secondary/90",
                destructive: "bg-error text-white hover:bg-error/90",
                outline: "border bg-background hover:bg-muted",
                ghost: "hover:bg-muted",
                link: "text-brand-primary underline-offset-4 hover:underline",
            },
            size: {
                sm: "h-9 px-3",
                md: "h-10 px-4 py-2",
                lg: "h-11 px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
        },
    }
);
```

## Building on Top of shadcn

Create domain-specific components that compose shadcn primitives:

```typescript
// src/modules/articles/presentation/components/ArticleCard/index.tsx
import { Card, CardContent, CardFooter, CardHeader } from "@/shared/presentation/components/ui/card";
import { Badge } from "@/shared/presentation/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/presentation/components/ui/avatar";

export function ArticleCard({ article }: { article: IArticleSummaryEntity }) {
    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="p-0">
                <Image
                    src={article.coverImageUrl}
                    alt={article.title}
                    width={400}
                    height={225}
                    className="aspect-video object-cover"
                />
            </CardHeader>
            <CardContent className="p-4">
                <Badge variant="secondary" className="mb-2">
                    {article.categoryName}
                </Badge>
                <h3 className="text-lg font-semibold line-clamp-2">
                    {article.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {article.headline}
                </p>
            </CardContent>
            <CardFooter className="px-4 pb-4 pt-0 flex items-center gap-2">
                <Avatar className="h-6 w-6">
                    <AvatarImage src={article.author?.avatarUrl} />
                    <AvatarFallback>{article.author?.userName?.[0]}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">
                    {article.author?.userName}
                </span>
            </CardFooter>
        </Card>
    );
}
```

This keeps shadcn as the low-level building block and your module components as the high-level, domain-aware layer.

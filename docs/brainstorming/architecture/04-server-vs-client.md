# Server vs Client Components

## The Default is Server

In Next.js 16 App Router, every component is a Server Component unless you add `"use client"` at the top. This is the opposite of the dashboard where everything is a Client Component by default (because it is a Vite SPA).

## When to Use Server Components

Use Server Components for anything that:

- Fetches data from the API
- Renders HTML that does not need interactivity
- Accesses server-only resources (cookies, headers, environment variables)
- Should not ship JavaScript to the client

### Examples in 116

| Page/Component | Type | Why |
| --- | --- | --- |
| Article list page | Server | Fetches articles, renders cards, zero JS needed |
| Article body | Server | Renders HTML content, no interactivity |
| Video detail page | Server | Fetches video data, renders metadata |
| Lyrics page | Server | Renders text content, great for SEO |
| Header navigation | Server | Static links, no state |
| Footer | Server | Static content |
| SEO metadata | Server | Generated from API data |

## When to Use Client Components

Use Client Components (`"use client"`) for anything that:

- Uses React hooks (`useState`, `useEffect`, `useRef`)
- Has event handlers (`onClick`, `onSubmit`, `onChange`)
- Uses browser APIs (`window`, `localStorage`, `navigator`)
- Uses third-party client libraries (video players, carousels, modals)
- Needs React Query for mutations or client-side data fetching

### Examples in 116

| Component | Type | Why |
| --- | --- | --- |
| Like button | Client | onClick handler, optimistic update |
| Comment form | Client | Form state, submission |
| Search bar | Client | Input state, debounced API calls |
| Video player | Client | Plyr or YouTube embed needs browser APIs |
| Share modal | Client | Clipboard API, modal state |
| Mobile menu | Client | Open/close state |
| Theme toggle | Client | localStorage for preference |
| Infinite scroll | Client | Intersection Observer API |

## The Boundary Rule

The `"use client"` directive creates a boundary. Everything imported by a Client Component becomes client code, even if it does not have the directive. This means:

```text
ServerComponent.tsx (no directive)
  imports ClientComponent.tsx ("use client")
    imports HelperComponent.tsx (no directive, but runs on client)
    imports utils.ts (no directive, but bundled for client)
```

To keep the client bundle small:

1. Push `"use client"` as far down the tree as possible
2. Never put `"use client"` on a page or layout component
3. Extract the interactive part into its own file with `"use client"`
4. Pass server data to Client Components as props (serializable only)

## Passing Data Across the Boundary

Server Components can pass data to Client Components as props, but the data must be serializable (no functions, no class instances, no Maps/Sets).

```typescript
// Server Component fetches data
async function VideoDetailContainer({ slug }: { slug: string }) {
    const video = await fetchVideo(slug);

    return (
        <div>
            <h1>{video.title}</h1>
            {/* Pass serializable data to client */}
            <VideoPlayer youtubeUrl={video.youtubeVideoUrl} />
            <VideoInteractions videoId={video.id} hasLyrics={video.hasLyrics} />
        </div>
    );
}

// Client Component receives serializable props
"use client";
function VideoInteractions({ videoId, hasLyrics }: { videoId: string; hasLyrics: boolean }) {
    const like = useLikeVideo(videoId);
    // ...
}
```

## Common Mistakes

### Mistake 1: Making the entire page a Client Component

```typescript
// Bad: entire page is client-rendered
"use client";
export default function ArticlesPage() {
    const [articles, setArticles] = useState([]);
    useEffect(() => { fetchArticles().then(setArticles); }, []);
    // ...
}
```

This kills SEO. Google sees an empty page until JavaScript loads and fetches data. Use a Server Component instead.

### Mistake 2: Importing a Client Component into a Server Component's module scope when not needed

If you import a large client library at the module level of a Server Component, it might get bundled incorrectly. Use dynamic imports for heavy client libraries:

```typescript
import dynamic from "next/dynamic";

const VideoPlayer = dynamic(() => import("./VideoPlayer"), {
    ssr: false,
    loading: () => <VideoPlayerSkeleton />,
});
```

### Mistake 3: Fetching data in Client Components when Server Components would work

If the data does not change based on user interaction (article content, video metadata), fetch it on the server. Only use client-side fetching for data that changes per user (bookmarks, likes, playlists).

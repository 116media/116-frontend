# Open Graph and Social Sharing

## Why It Matters

When someone shares a 116 article on WhatsApp, Facebook, or Twitter, the preview card is controlled by Open Graph tags. Without them, the shared link shows a plain URL with no image or description. With them, it shows a rich card with the article cover image, title, and description.

WhatsApp is the primary sharing channel for the 116 audience in DR and Africa.

## Open Graph Tags

Next.js Metadata API generates OG tags automatically from the `openGraph` field:

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const article = await fetchArticle(params.slug);

    return {
        openGraph: {
            title: article.metaTitle || article.title,
            description: article.metaDescription || article.headline,
            type: "article",
            url: `https://116.cd/articles/${article.slug}`,
            siteName: "116",
            locale: "fr_CD",
            publishedTime: article.publishedAt || undefined,
            authors: article.author ? [article.author.userName] : undefined,
            images: [
                {
                    url: article.coverImageUrl,
                    width: 1200,
                    height: 630,
                    alt: article.title,
                },
            ],
        },
    };
}
```

## Twitter Card Tags

```typescript
twitter: {
    card: "summary_large_image",
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.headline,
    images: [article.coverImageUrl],
    creator: "@116media",
    site: "@116media",
},
```

## Image Dimensions

| Platform | Recommended Size | Aspect Ratio |
| --- | --- | --- |
| Open Graph (Facebook, WhatsApp, LinkedIn) | 1200 x 630 | 1.91:1 |
| Twitter summary_large_image | 1200 x 628 | 1.91:1 |
| Twitter summary (small) | 120 x 120 | 1:1 |

The backend stores cover images via Cloudinary. Use Cloudinary URL transformations to get the right size:

```typescript
function ogImageUrl(originalUrl: string): string {
    return originalUrl.replace(
        "/image/upload/",
        "/image/upload/w_1200,h_630,c_fill,g_auto,f_auto,q_auto/"
    );
}
```

## Per-Content-Type OG Types

| Content | OG Type | Extra Fields |
| --- | --- | --- |
| Home page | `website` | None |
| Article | `article` | `publishedTime`, `authors`, `tags` |
| Video | `video.other` | `videos` array with YouTube URL |
| Lyrics | `website` | Song title in description |
| User profile | `profile` | `firstName`, `lastName` |

## Testing Social Previews

- Facebook: https://developers.facebook.com/tools/debug/
- Twitter: https://cards-dev.twitter.com/validator
- LinkedIn: https://www.linkedin.com/post-inspector/
- WhatsApp: Send the link to yourself and check the preview

After deploying, if the preview is wrong, use the Facebook debugger to "Scrape Again" and clear the cache.

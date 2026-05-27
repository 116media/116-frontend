# Colors

## Brand Colors

The 116 brand uses a purple and pink palette that reflects the energy of music and hip-hop culture.

| Name | Hex | Usage |
| --- | --- | --- |
| Brand Primary | `#490fd2` | Primary buttons, links, active states, brand accents |
| Brand Secondary | `#ff74d4` | Secondary accents, highlights, gradients |

## Semantic Colors

| Name | Hex | Usage |
| --- | --- | --- |
| Success | `#1dd3b0` | Published status, verification badges, success toasts |
| Error | `#ef476f` | Form errors, delete actions, rejected status |
| Warning | `#f07f34` | Pending states, expiry notices |
| Info | `#3b82f6` | Informational badges, help tooltips |

## Neutral Scale

Used for text, backgrounds, borders, and surfaces. The scale goes from 50 (lightest) to 950 (darkest).

| Token | Light Mode | Dark Mode | Usage |
| --- | --- | --- | --- |
| `background` | `#ffffff` | `#0a0a0a` | Page background |
| `foreground` | `#171717` | `#fafafa` | Primary text |
| `card` | `#ffffff` | `#171717` | Card surfaces |
| `muted` | `#f5f5f5` | `#262626` | Muted backgrounds |
| `muted-foreground` | `#737373` | `#a3a3a3` | Secondary text, captions |
| `border` | `#e5e5e5` | `#262626` | Borders, dividers |

## Social Colors

For social login buttons and share icons:

| Platform | Hex |
| --- | --- |
| Twitter/X | `#000000` |
| Instagram | `#E1306C` |
| Facebook | `#1877F2` |
| YouTube | `#FF0000` |
| TikTok | `#000000` |

## Usage Guidelines

### Do

- Use `brand-primary` for all primary CTAs and interactive elements
- Use `muted-foreground` for secondary text and metadata (dates, view counts)
- Use semantic colors only for their intended purpose (success for success, error for errors)
- Use the neutral scale for all grays instead of arbitrary values

### Do Not

- Never hardcode hex values in components. Always use Tailwind classes that reference tokens
- Never use `brand-primary` for text on white backgrounds (contrast ratio is too low for body text). Use it for buttons and large headings only
- Never mix the dashboard's SCSS variable names with the frontend's CSS variable names

# 22 — Internationalization, Accessibility & Responsive Behavior

## Internationalization

Add one `favorites` namespace to both English and French message catalogs. It contains the
three route labels, ten inner collection labels, counts, activity metadata, empty/error copy,
playlist actions, confirmation copy, and authentication prompt. Dates and plural counts
use the project's locale-aware formatters; components do not assemble translated sentences.
Add the account-menu group and three destination labels under the existing settings menu
namespace rather than duplicating the Favorites page catalog there.

## Accessibility

- Primary side navigation uses ordinary links with current-page indication; inner collection
  navigation may use the existing Tabs semantics.
- Preserve arrow-key tab navigation, visible focus, and selected-state announcement.
- Give every panel a stable id and matching `aria-controls` relationship.
- Announce appended result counts through a polite live region without moving focus.
- Playlist menus and dialogs remain keyboard operable and restore focus to their trigger.
- Comment/playlist drawers trap focus while open, close with Escape, label their purpose, and
  restore focus to the originating card action.
- Icon-only actions require translated accessible names.
- Do not encode rating, activity type, or selected state by color alone.

## Responsive behavior

The three-item side navigation becomes a horizontal strip on narrow screens. Inner collection
rows scroll only when necessary. Existing article and video grids retain their breakpoints. Playlist
cards use a single column on mobile, then increase columns through the shared grid tokens.
Short-video results use portrait cards with appropriate responsive columns.
Touch targets remain at least 44 by 44 CSS pixels.

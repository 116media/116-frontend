# 03 — Buckets & Folder Anatomy

## Folder anatomy

### Strict component folder (the default)

```
<Component>/
├── <Component>.tsx            # the component (private single-use sub-parts inline)
├── <Component>.Loading.tsx    # state files — only when applicable, flat (no states/)
├── <Component>.Error.tsx
├── <Component>.Empty.tsx
├── <Component>.NotFound.tsx
├── types.ts                   # only when a type is shared by ≥2 files in this folder
├── constants.ts | variants.ts # carve-out (R13): only for folder-local content too large to inline
└── index.ts                   # barrel
```

Most folders are just `<Component>.tsx` + `index.ts`. A folder with a state view that shares
the props type adds `types.ts`. The `constants.ts`/`variants.ts` carve-out (R13) is rare —
only when a folder-local `Record<>`/variant map is too big to inline (e.g. `ThemeToggle`,
`FlashToast`); small values stay inline, reused values go to the module `constants/`.

### Compound component folder (the exception — R8)

```
<Compound>/
├── <Compound>.<Variant>.tsx   # variants / intrinsic parts as dotted files
├── <Compound>.<Part>.tsx
├── types.ts                   # shared family/props types
├── constants.ts | variants.ts # optional, shared across the parts
└── index.ts                   # assembles the namespace: export const X = { A, B }
```

Used for: card families, `VideoPlayer`, mega-menus, `ArticlesToolbar`, `SocialLogin`,
`LanguageDropdown`. Never nests a component sub-folder — parts are files.

### Container folder

```
<Surface>Container/
├── <Surface>Container.tsx
└── index.ts
```

## Buckets

A **bucket** is a grouping folder with no component of its own. Buckets may contain buckets
and component folders; component folders are leaves (R6). Use only the buckets a module needs.

| Bucket | Holds | Examples |
|---|---|---|
| `containers/` | smart route/section shells (R2) | `VideoDetailContainer`, `ArticlesFeedContainer` |
| `pages/` | the presentational page assembler + its state files | `VideoDetail`, `ArticleDetail` |
| `sections/` | composable page regions & homepage sections (incl. island sidebars) | `VideoDetailHeader`, `VideoFeedSection`, `ArticlesGrid`, `ArticlesPopularSidebar` |
| `cards/` | cards (compound families or standalone) | `VideoCard`, `ArticleCard`, `ShowCard`, `SettingsCard` |
| `carousels/` | feature carousel wrappers | `HeroCarousel`, `ShowsCarousel` |
| `media/` | players / posters / video surfaces | `VideoPlayer` |
| `modals/` | dialog surfaces | `VideoShareModal`, `ProfileEditModal` |
| `navigation/` | menus, mega-menus, toolbars, nav sidebars | `VideosMegaMenu`, `ArticlesToolbar`, `SettingsSidebar` |
| `forms/` | forms | `LoginForm`, `ChangePasswordForm` |
| `fields/` | display/input field units | `DetailField` |
| `lists/` | list containers | `SessionsList` |
| `social/` | social-auth widgets | `SocialLogin` |
| `feedback/` | shared skeleton/empty/error primitives (module-level, if any) | — |

Notes:
- **`sections/` mixes page-parts and homepage sections on purpose** — they are all "regions."
  The name prefix (`VideoDetail*`) sorts a page's parts together. Findability by *page* is via
  the prefix; findability by *kind* is via the bucket.
- A component's bucket is decided by **what it is**, not who uses it. `ShowCard` is a card
  even though only `ShowsCarousel` uses it today.
- **Sidebars split by function.** A *navigational* sidebar (links to sub-routes, e.g.
  `SettingsSidebar`) is `navigation/`. A *content* sidebar (a list/strip of cards, e.g.
  `VideosPopularSidebar`, `ArticlesPopularSidebar`) is a page region → `sections/`. Rule:
  `navigation/` = things you navigate *with* (menus, nav-sidebars, filter toolbars); content
  regions → `sections/`.
- **`feedback/` is reserved.** No module needs it yet (state views live flat in each
  component's folder — R7). Add it only if a genuinely shared skeleton/empty/error *primitive*
  emerges; otherwise such primitives belong in `shared/presentation/components/ui`.

## State files (R7)

Loading/Error/Empty/NotFound/EndOfFeed are **flat dotted files inside the component's own
folder** — never a `states/` sub-folder, never their own component folder. The container (or
island) imports and switches between them. `ArticlesGrid` is the fullest example:

```
sections/ArticlesGrid/
├── ArticlesGrid.tsx
├── ArticlesGrid.Loading.tsx
├── ArticlesGrid.Empty.tsx
├── ArticlesGrid.Error.tsx
├── ArticlesGrid.EndOfFeed.tsx
└── index.ts
```

A private one-off skeleton (a single `<Skeleton>` cluster used only inside the loading file)
stays inline in that file (R7a); it does not get its own file unless it's reused.

## The promotion ladder (R10/R14)

```
inline (private, single caller)
   │  used by a 2nd file in the folder?
   ▼
own file / own folder in the module bucket
   │  imported by a 2nd module?
   ▼
shared/presentation/components/<kind>/
```

The same ladder governs components, types (`types.ts`), constants, and helpers. Nothing is
"shared" until a second consumer proves it — this prevents premature abstraction, which the
import-graph audit showed is the real risk (reuse here is overwhelmingly module-internal).

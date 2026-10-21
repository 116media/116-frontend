# The header below `md`

## Required end state

> on mobile at the navbar you will only keep the hamburger menu, the logo and the
> connect or profile/avatar buttons.

## Today

```tsx
// src/shared/presentation/layouts/Header/Header.tsx
<div className="flex h-16 items-center justify-between gap-2">
    <MobileNav />                               {/* md:hidden */}
    <Logo priority canRedirect className="size-9 sm:size-12 md:size-10 lg:size-12" />
    <DesktopNav videos={videos} articles={articles} />   {/* hidden md:flex */}

    <div className="flex items-center gap-6">
        <div className="flex items-center gap-1">
            <ThemeToggle />                     {/* always visible */}
            <LanguageDropdown placement="bottom" />  {/* always visible */}
        </div>
        <UserAccountControl />
    </div>
</div>
```

Below `md` that renders five controls: hamburger, logo, theme, language, auth. The
brief wants three.

## Change

```diff
 <div className="flex h-16 items-center justify-between gap-2">
-    <MobileNav />
+    <MobileMegaMenu
+        videos={videos}
+        articles={articles}
+    />

     <Logo
         priority
         canRedirect
         className="size-9 sm:size-12 md:size-10 lg:size-12"
     />

     <DesktopNav
         videos={videos}
         articles={articles}
     />

     <div className="flex items-center gap-6">
-        <div className="flex items-center gap-1">
+        <div className="hidden items-center gap-1 md:flex">
             <ThemeToggle />
             <LanguageDropdown placement="bottom" />
         </div>
         <UserAccountControl />
     </div>
 </div>
```

Two edits: the trigger swap, and `hidden … md:flex` on the theme/language pair.
`UserAccountControl` stays at every width — it is the "connect or profile/avatar"
control the brief keeps.

Theme and language do not disappear on mobile; they move into the panel footer
(03, `MobileMegaMenu.Footer`), which is where the artboard puts them.

## Result

| Width | Header contents |
| --- | --- |
| `< md` | hamburger · logo · auth |
| `>= md` | logo · DesktopNav · theme · language · auth |

## Why the trigger lives inside `MobileMegaMenu`

`Dialog.Trigger` must be a descendant of `Dialog.Root` for Radix to wire
`aria-expanded`, `aria-controls` and focus restoration. Hoisting the button into
`Header` and passing an `onOpen` callback would break all three. So `MobileMegaMenu`
renders its own trigger, exactly as `MobileNav` does today, and `Header` just places
the component where the button should appear.

## Deleting `MobileNav`

`src/shared/presentation/layouts/MobileNav/` is removed once `Header` no longer
imports it. Check for other importers first:

```bash
grep -rn "MobileNav" src app
```

At the time of writing, `Header.tsx` is the only one.

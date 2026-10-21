# Motion and gestures

## The defect this fixes

`MobileNav` today is a left-anchored drawer animated with `dialog-in`:

```css
/* src/shared/presentation/styles/globals.css */
@keyframes dialog-in {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
}
```

That is a **vertical** rise written for centred modals. A panel anchored to the left
edge should travel on X. The current drawer therefore floats up from below instead of
sliding in from the side.

## New keyframes

Add to `globals.css`, beside the existing dialog keyframes:

```css
@keyframes sheet-in-left {
    from { transform: translateX(-100%); }
    to   { transform: translateX(0); }
}

@keyframes sheet-out-left {
    from { transform: translateX(0); }
    to   { transform: translateX(-100%); }
}
```

Register them in the `@theme` block of `theme.css`, next to the other named
animations, so components use the utility and never re-author the timing:

```css
--animate-sheet-in-left: sheet-in-left 0.28s cubic-bezier(0.16, 1, 0.3, 1);
--animate-sheet-out-left: sheet-out-left 0.2s ease-in;
```

The in-curve and both durations are copied from `--animate-dialog-in` /
`--animate-dialog-out` so the panel feels like the rest of the app's surfaces.

The overlay keeps the existing `--animate-dialog-overlay-in` / `-out`.

## Reduced motion

**There is no `prefers-reduced-motion` guard anywhere in `styles/`.** Verified:

```bash
grep -rn "prefers-reduced-motion" src/shared/presentation/styles/   # no matches
```

So every named animation in the app currently plays regardless of the OS setting.
Add the guard to `globals.css` as part of this work; it covers the new keyframes and
the eight that already exist:

```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

The panel still appears and disappears, it just does not travel. This is a global
fix, not a fix for this component: `dialog-in`, `mega-menu-slide-down`,
`short-like-burst` and the rest all gain the same respect for the setting.

## Swipe to close

The artboard specifies "swipe toward the leading edge to close". Pointer events, no
library — `motion` is already a dependency but a drag wrapper here would fight Radix's
focus trap.

```tsx
const [dragX, setDragX] = useState(0);
const startX = useRef<number | null>(null);

const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") return;
    startX.current = event.clientX;
};

const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return;
    // Leftward travel only: a rightward drag is a scroll or an overscroll, not a close.
    setDragX(Math.min(0, event.clientX - startX.current));
};

const onPointerUp = () => {
    if (dragX < -SWIPE_CLOSE_THRESHOLD) setIsOpen(false);
    startX.current = null;
    setDragX(0);
};
```

Applied to `Dialog.Content`:

```tsx
<DialogPrimitive.Content
    onPointerDown={onPointerDown}
    onPointerMove={onPointerMove}
    onPointerUp={onPointerUp}
    onPointerCancel={onPointerUp}
    style={dragX === 0 ? undefined : { transform: `translateX(${dragX}px)` }}
    className={cn(
        "fixed inset-0 z-50 flex flex-col bg-background md:hidden",
        // While dragging, the inline transform owns the position: suppress the
        // entry animation so the two do not fight for the same property.
        dragX === 0 && "data-[state=open]:animate-sheet-in-left",
        "data-[state=closed]:animate-sheet-out-left"
    )}
>
```

Three details that matter:

- `event.pointerType === "mouse"` is skipped so a desktop drag-select inside the
  panel cannot dismiss it. The panel is `md:hidden`, but a narrow desktop window is
  still a mouse.
- `Math.min(0, …)` clamps to leftward travel. Dragging right would otherwise pull the
  panel off its own edge and reveal the overlay underneath.
- `style` is applied only while a drag is live (`dragX !== 0`). An always-present
  inline `transform: translateX(0)` would override the keyframes, because inline
  styles beat animation fill in the cascade, and the panel would appear with no
  transition at all.

`SWIPE_CLOSE_THRESHOLD` is `120`, defined in `constants.ts`.

## What is not animated

The tab panels get their transition free from `TabsContent`, which already applies a
direction-aware slide and fade driven by the `Tabs` root's direction context. Do not
add a second animation on top of it.

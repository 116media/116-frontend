# Spec 05 — Modal Player

Design ref: [../05-modal-player.md](../05-modal-player.md). The context provider, the
full-screen shell, the shared player extended to file sources, and the compound slots.
Gestures are layered in
[06-gestures-and-shortcuts.md](06-gestures-and-shortcuts.md); the rail in
[07-interactions-like-share.md](07-interactions-like-share.md).

---

## 1. Context — `ShortsPlayerProvider`

`src/modules/shorts/presentation/context/ShortsPlayerProvider.tsx`

Holds the feed slice, the active index, and playback state; exposes navigation and playback
actions. Slots read it via a `useShortsPlayer` hook.

```tsx
"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";

/**
 * ShortsPlayerContextValue
 *
 * @description
 * The player's shared state and actions, consumed by every compound slot.
 *
 * @interface ShortsPlayerContextValue
 * @property {IShortVideoEntity[]} shorts - The ordered feed slice.
 * @property {number} activeIndex - Index of the short currently in view.
 * @property {boolean} isPlaying - Whether the active short is playing.
 * @property {boolean} isMuted - Session-wide mute state.
 * @property {(index: number) => void} goTo - Activate a short by index.
 * @property {() => void} goNext - Advance to the next short.
 * @property {() => void} goPrev - Return to the previous short.
 * @property {() => void} togglePlay - Pause/unpause the active short.
 * @property {() => void} toggleMute - Toggle session mute.
 */
export interface ShortsPlayerContextValue {
    shorts: IShortVideoEntity[];
    activeIndex: number;
    isPlaying: boolean;
    isMuted: boolean;
    goTo: (index: number) => void;
    goNext: () => void;
    goPrev: () => void;
    togglePlay: () => void;
    toggleMute: () => void;
}

const ShortsPlayerContext = createContext<ShortsPlayerContextValue | null>(null);

/**
 * useShortsPlayer
 *
 * @description
 * Reads the shorts-player context; throws when used outside the provider.
 *
 * @returns {ShortsPlayerContextValue} The player context value.
 */
export function useShortsPlayer(): ShortsPlayerContextValue {
    const ctx = useContext(ShortsPlayerContext);
    if (!ctx) throw new Error("useShortsPlayer must be used within ShortsPlayerProvider");
    return ctx;
}

/**
 * Props for the ShortsPlayerProvider component.
 *
 * @interface ShortsPlayerProviderProps
 * @property {IShortVideoEntity[]} shorts - The feed slice to play through.
 * @property {number} initialIndex - The short to open on.
 * @property {boolean} hasNextPage - Whether more shorts can be loaded.
 * @property {() => void} onLoadMore - Fetches the next page as the end nears.
 * @property {React.ReactNode} children - The compound slots.
 */
export interface ShortsPlayerProviderProps {
    shorts: IShortVideoEntity[];
    initialIndex: number;
    hasNextPage: boolean;
    onLoadMore: () => void;
    children: React.ReactNode;
}

/**
 * ShortsPlayerProvider
 *
 * @description
 * Owns active-index and playback state for the player, triggering `onLoadMore`
 * as the reader nears the last loaded short.
 */
export function ShortsPlayerProvider({
    shorts,
    initialIndex,
    hasNextPage,
    onLoadMore,
    children
}: ShortsPlayerProviderProps) {
    const [activeIndex, setActiveIndex] = useState(initialIndex);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);

    const goTo = useCallback(
        (index: number) => {
            const clamped = Math.max(0, Math.min(index, shorts.length - 1));
            setActiveIndex(clamped);
            setIsPlaying(true);
            if (hasNextPage && clamped >= shorts.length - 2) onLoadMore();
        },
        [shorts.length, hasNextPage, onLoadMore]
    );

    const value = useMemo<ShortsPlayerContextValue>(
        () => ({
            shorts,
            activeIndex,
            isPlaying,
            isMuted,
            goTo,
            goNext: () => goTo(activeIndex + 1),
            goPrev: () => goTo(activeIndex - 1),
            togglePlay: () => setIsPlaying((p) => !p),
            toggleMute: () => setIsMuted((m) => !m)
        }),
        [shorts, activeIndex, isPlaying, isMuted, goTo]
    );

    return <ShortsPlayerContext.Provider value={value}>{children}</ShortsPlayerContext.Provider>;
}
```

## 2. Extend the shared `VideoPlayer` to remote files

The shared `VideoPlayer` is already Plyr-based and themed (`video-plyr.css` binds Plyr vars
to theme tokens). Extend it to accept a direct file/remote `videoUrl` in addition to
`youtubeVideoUrl`, plus `ratio` / `controls` preset / playback flags / a Plyr ref — matching
the dashboard's dual-source player. The theme skin is unchanged.

A MIME helper (`src/shared/presentation/utils/video/video.utils.ts`), mirroring the
dashboard's extension→type inference:

```ts
/**
 * videoMimeType
 *
 * @description
 * Infers a `<video>` MIME type from a file URL's extension for Plyr's file source.
 * Falls back to `video/mp4` for unknown extensions.
 *
 * @param url - The direct file/remote video URL.
 * @returns {string} The inferred MIME type.
 */
export function videoMimeType(url: string): string {
    const ext = url.split("?")[0].split(".").pop()?.toLowerCase();
    const map: Record<string, string> = {
        mp4: "video/mp4",
        mov: "video/quicktime",
        webm: "video/webm",
        avi: "video/x-msvideo",
        mkv: "video/x-matroska",
        "3gp": "video/3gpp"
    };
    return (ext && map[ext]) || "video/mp4";
}
```

`VideoPlayer.tsx` — the props gain `videoUrl`, `ratio`, `controls`, and playback flags;
source precedence is YouTube → file → poster-only:

```ts
/**
 * Props for VideoPlayer.
 *
 * @interface VideoPlayerProps
 * @property {string} title - Poster alt text / accessible label.
 * @property {string | null} thumbnailUrl - Poster frame.
 * @property {string | null} [youtubeVideoUrl] - YouTube URL source (takes precedence).
 * @property {string | null} [videoUrl] - Direct file/remote URL source.
 * @property {string} [ratio] - Aspect ratio, e.g. "16:9" (default) or "9:16".
 * @property {"full" | "bare"} [controls] - Control-set preset; "bare" hides chrome for shorts.
 * @property {boolean} [autoPlay] - Autoplay on mount.
 * @property {boolean} [muted] - Start muted (required for autoplay).
 * @property {boolean} [loop] - Loop playback.
 */
export interface VideoPlayerProps {
    title: string;
    thumbnailUrl: string | null;
    youtubeVideoUrl?: string | null;
    videoUrl?: string | null;
    ratio?: string;
    controls?: "full" | "bare";
    autoPlay?: boolean;
    muted?: boolean;
    loop?: boolean;
}
```

`VideoPlayer.Plyr.tsx` — build the Plyr source from whichever URL is present, choose the
control preset, forward a ref to the Plyr instance for imperative play/pause:

```ts
import { forwardRef } from "react";
import { Plyr as PlyrReact, type APITypes } from "plyr-react";

import { videoMimeType } from "@/shared/presentation/utils/video/video.utils";

const CONTROL_PRESETS: Record<"full" | "bare", Plyr.Options["controls"]> = {
    full: ["play-large", "play", "progress", "current-time", "mute", "volume", "settings", "fullscreen"],
    bare: ["progress"]
};

/**
 * Props for VideoPlayer.Plyr.
 *
 * @interface VideoPlayerPlyrProps
 * @property {string} [youtubeId] - YouTube id source (takes precedence).
 * @property {string} [videoUrl] - Direct file source.
 * @property {string} ratio - Aspect ratio.
 * @property {"full" | "bare"} controls - Control-set preset.
 * @property {boolean} [autoPlay] - Autoplay on mount.
 * @property {boolean} [muted] - Start muted.
 * @property {boolean} [loop] - Loop playback.
 */
export interface VideoPlayerPlyrProps {
    youtubeId?: string;
    videoUrl?: string;
    ratio: string;
    controls: "full" | "bare";
    autoPlay?: boolean;
    muted?: boolean;
    loop?: boolean;
}

/**
 * VideoPlayer.Plyr
 *
 * @description
 * Client-only Plyr embed for either a YouTube id or a direct file URL, carrying the
 * brand skin. Loaded only through `next/dynamic(..., { ssr: false })` since Plyr
 * touches `window`. Forwards the Plyr API ref so callers can drive playback.
 */
const VideoPlayerPlyr = forwardRef<APITypes, VideoPlayerPlyrProps>(function VideoPlayerPlyr(
    { youtubeId, videoUrl, ratio, controls, autoPlay, muted, loop },
    ref
) {
    const source: Plyr.SourceInfo = youtubeId
        ? { type: "video", sources: [{ src: youtubeId, provider: "youtube" }] }
        : { type: "video", sources: [{ src: videoUrl ?? "", type: videoMimeType(videoUrl ?? "") }] };

    return (
        <PlyrReact
            ref={ref}
            source={source}
            options={{
                controls: CONTROL_PRESETS[controls],
                ratio,
                clickToPlay: controls === "full",
                hideControls: true,
                resetOnEnd: !loop,
                autoplay: autoPlay,
                muted,
                loop: { active: Boolean(loop) }
            }}
        />
    );
});

export default VideoPlayerPlyr;
```

`VideoPlayer.tsx` chooses the branch (`youtubeId = extractYoutubeId(youtubeVideoUrl)`; else
`videoUrl`; else poster-only) and threads `ratio` / `controls` / flags / ref through. Its
existing `.video-player` wrapper + `video-plyr.css` theme stay as-is (a `9:16` ratio just
makes the frame portrait). The default call (`<VideoPlayer title thumbnailUrl
youtubeVideoUrl />`) is unchanged — `ratio` defaults `"16:9"`, `controls` defaults `"full"` —
so the video detail page keeps working untouched.

## 2b. `ShortVideoPlayer` (thin wrapper)

`src/modules/shorts/presentation/components/media/ShortVideoPlayer/ShortVideoPlayer.tsx`

Configures the shared player for the TikTok surface and orchestrates active/paused/mute via
the Plyr ref: plays muted when active, pauses + rewinds when it leaves view.

```tsx
"use client";

import { useEffect, useRef } from "react";
import type { APITypes } from "plyr-react";

import { VideoPlayer } from "@/shared/presentation/components/common/VideoPlayer";

/**
 * Props for the ShortVideoPlayer component.
 *
 * @interface ShortVideoPlayerProps
 * @property {string | null} videoUrl - Cloudinary file URL, or null (poster only).
 * @property {string | null} thumbnailUrl - Poster URL.
 * @property {string} title - Accessible label.
 * @property {boolean} isActive - Whether this is the visible short.
 * @property {boolean} isPlaying - Desired play state for the active short.
 * @property {boolean} isMuted - Session mute state.
 */
export interface ShortVideoPlayerProps {
    videoUrl: string | null;
    thumbnailUrl: string | null;
    title: string;
    isActive: boolean;
    isPlaying: boolean;
    isMuted: boolean;
}

/**
 * ShortVideoPlayer
 *
 * @description
 * The shared `VideoPlayer` configured for shorts: 9:16, bare chrome, looped,
 * muted-first. Drives play/pause on the underlying Plyr instance as the slide
 * becomes active or the reader taps to pause; rewinds when it leaves view.
 */
export function ShortVideoPlayer({
    videoUrl,
    thumbnailUrl,
    title,
    isActive,
    isPlaying,
    isMuted
}: ShortVideoPlayerProps) {
    const playerRef = useRef<APITypes>(null);

    useEffect(() => {
        const plyr = playerRef.current?.plyr;
        if (!plyr || typeof plyr.play !== "function") return;
        if (isActive && isPlaying) {
            void Promise.resolve(plyr.play()).catch(() => undefined);
        } else {
            plyr.pause();
            if (!isActive) plyr.currentTime = 0;
        }
    }, [isActive, isPlaying]);

    useEffect(() => {
        const plyr = playerRef.current?.plyr;
        if (plyr) plyr.muted = isMuted;
    }, [isMuted]);

    return (
        <VideoPlayer
            ref={playerRef}
            title={title}
            thumbnailUrl={thumbnailUrl}
            videoUrl={videoUrl}
            ratio="9:16"
            controls="bare"
            loop
            muted={isMuted}
            autoPlay={isActive}
        />
    );
}
```

The `VideoPlayer` must forward the ref to its inner `VideoPlayer.Plyr` (add `forwardRef` to
`VideoPlayer.tsx` too, or expose a `playerRef` prop). Confirm the `plyr-react` ref API
(`ref.current.plyr`) against the installed version before wiring.

## 3. Shell — `ShortsPlayer`

`src/modules/shorts/presentation/components/modals/ShortsPlayer/ShortsPlayer.tsx`

The portal + backdrop + stage, wrapping the provider. Reuses Radix `Dialog`
Root/Portal/Overlay for focus-trap, scroll-lock, and escape; overrides the centered card with
full-screen classes. (Fallback to `createPortal` if the focus-trap fights the video — see
[../10-open-questions.md](../10-open-questions.md).)

```tsx
"use client";

import { Dialog, DialogOverlay, DialogPortal } from "@/shared/presentation/components/ui/Dialog";
import { ShortsPlayerProvider } from "@/modules/shorts/presentation/context/ShortsPlayerProvider";
import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";

import { ShortsPlayerTrack } from "./ShortsPlayer.Track";
import { ShortsPlayerNav } from "./ShortsPlayer.Nav";
import { ShortsPlayerClose } from "./ShortsPlayer.Close";

/**
 * Props for the ShortsPlayer component.
 *
 * @interface ShortsPlayerProps
 * @property {IShortVideoEntity[]} shorts - The feed slice to play through.
 * @property {number} initialIndex - The short to open on.
 * @property {boolean} hasNextPage - Whether more shorts can be loaded.
 * @property {() => void} onLoadMore - Fetches the next page as the end nears.
 * @property {() => void} onClose - Closes the modal.
 */
export interface ShortsPlayerProps {
    shorts: IShortVideoEntity[];
    initialIndex: number;
    hasNextPage: boolean;
    onLoadMore: () => void;
    onClose: () => void;
}

/**
 * ShortsPlayer
 *
 * @description
 * Full-screen, swipeable short-video player. Dark full-bleed backdrop over a 9:16
 * stage; the vertical track snaps one short per gesture, with up/down nav and a
 * close control.
 */
export function ShortsPlayer({
    shorts,
    initialIndex,
    hasNextPage,
    onLoadMore,
    onClose
}: ShortsPlayerProps) {
    return (
        <Dialog open onOpenChange={(next) => !next && onClose()}>
            <DialogPortal>
                <DialogOverlay className="bg-black/90" />
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-50 flex items-center justify-center"
                >
                    <ShortsPlayerProvider
                        shorts={shorts}
                        initialIndex={initialIndex}
                        hasNextPage={hasNextPage}
                        onLoadMore={onLoadMore}
                    >
                        <div className="relative aspect-[9/16] h-[min(90vh,calc(100vw*16/9))] overflow-hidden rounded-lg bg-black">
                            <ShortsPlayerTrack />
                            <ShortsPlayerNav />
                        </div>
                        <ShortsPlayerClose onClose={onClose} />
                    </ShortsPlayerProvider>
                </div>
            </DialogPortal>
        </Dialog>
    );
}
```

## 4. Track & Slide

`ShortsPlayer.Track.tsx` — the vertical scroll-snap column; an `IntersectionObserver` marks
the most-visible slide active via `goTo`. `ShortsPlayer.Slide.tsx` — one short: the
`ShortVideoPlayer`, the tap layer ([06](06-gestures-and-shortcuts.md)), the action rail
([07](07-interactions-like-share.md)), the caption, and the like-burst. The track renders one
`ShortsPlayer.Slide` per short and lets native snap + observer drive the active index.

```tsx
"use client";

import { useShortsPlayer } from "@/modules/shorts/presentation/context/ShortsPlayerProvider";

import { ShortsPlayerSlide } from "./ShortsPlayer.Slide";

/**
 * ShortsPlayerTrack
 *
 * @description
 * Vertical scroll-snap column of slides. Native snap handles swipe physics; an
 * IntersectionObserver (in each slide) reports the active index to the context.
 */
export function ShortsPlayerTrack() {
    const { shorts } = useShortsPlayer();
    return (
        <div className="size-full snap-y snap-mandatory overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {shorts.map((short, index) => (
                <ShortsPlayerSlide key={short.id} short={short} index={index} />
            ))}
        </div>
    );
}
```

`ShortsPlayerNav.tsx`, `ShortsPlayerClose.tsx`, `ShortsPlayer.Caption.tsx`,
`ShortsPlayer.LikeBurst.tsx`, `ShortsPlayer.ActionRail.tsx`, `types.ts`, and `index.ts` (which
assembles `ShortsPlayer.Track = …` etc. into the namespace) complete the folder. Keep every
part a dotted file in this one folder — no nested component folders.

---

## Tasks

- [ ] Shared `VideoPlayer` extended: `videoUrl` file source, `ratio`, `controls` preset, `autoPlay`/`muted`/`loop`, forwarded Plyr ref; `videoMimeType` helper added.
- [ ] Default `VideoPlayer` call (video detail page) unchanged — regression-checked.
- [ ] `ShortsPlayerProvider` + `useShortsPlayer` with active-index, playback, mute, nav, `onLoadMore` trigger.
- [ ] `ShortVideoPlayer` wrapper: shared player at 9:16/bare/loop/muted; play-on-active, pause+reset off-active via the Plyr ref; poster fallback.
- [ ] `plyr-react` ref API (`ref.current.plyr`) verified against the installed version.
- [ ] `ShortsPlayer` shell: portal, `bg-black/90` backdrop, 9:16 stage `h-[min(90vh,calc(100vw*16/9))] rounded-lg`, body scroll locked.
- [ ] `ShortsPlayer.Track` vertical snap column; observer-driven active index.
- [ ] `ShortsPlayer.Slide` composes player + tap layer + rail + caption + burst; scrollbar hidden.
- [ ] Compound assembled in `index.ts`; no nested component folders; dotted parts only.
- [ ] Focus trapped while open, restored to the originating tile on close.
- [ ] Colors are tokens only; 9:16 + scrim recipe matches the dashboard's `VideoPreview`.
- [ ] `tsc` + biome clean.
</content>

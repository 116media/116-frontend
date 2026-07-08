/**
 * getAuthChannel
 *
 * @description
 * Returns the single per-tab `BroadcastChannel('auth')`, created lazily.
 * Listener and posters must share this one instance so the originating tab
 * skips its own posts and only other tabs react.
 *
 * @returns The shared auth broadcast channel, or `null` during SSR.
 */
let channel: BroadcastChannel | null = null;

export function getAuthChannel(): BroadcastChannel | null {
    if (typeof window === "undefined") return null;
    if (!channel) channel = new BroadcastChannel("auth");
    return channel;
}

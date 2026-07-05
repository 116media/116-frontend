/**
 * getAuthChannel
 *
 * @description
 * Returns the single per-tab `BroadcastChannel('auth')`, created lazily on first
 * use. Both the listener (`AuthProvider`) and the posters (login/social-login/logout
 * hooks) MUST share this one instance: a `BroadcastChannel` never receives its own
 * posts, so routing every message through the same object means the originating tab
 * is skipped — only other tabs react. Creating a fresh channel per post (as `new
 * BroadcastChannel('auth')` would) makes the current tab receive its own ping and
 * needlessly refetch `me`. Returns `null` on the server, where the API is absent.
 *
 * @returns The shared auth broadcast channel, or `null` during SSR.
 */
let channel: BroadcastChannel | null = null;

export function getAuthChannel(): BroadcastChannel | null {
    if (typeof window === "undefined") return null;
    if (!channel) channel = new BroadcastChannel("auth");
    return channel;
}

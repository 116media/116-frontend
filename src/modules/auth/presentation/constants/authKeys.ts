/**
 * Stable TanStack Query keys for the auth module. `me` is the single source of
 * truth for the current user; everything (`useAuth`, SSR hydration, mutation
 * write-throughs) reads and writes this key.
 */
export const authKeys = {
    me: ["auth", "me"] as const,
    mutation: ["auth", "mutation"] as const,
    sessions: ["auth", "sessions"] as const,
    session: (id: string) => ["auth", "session", id] as const
};

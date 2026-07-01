# State Management — TanStack Query v5 + React Context

Two complementary tools:

- **TanStack Query v5** owns *server state*: the current user (`me`), the
  sessions list, and every auth *mutation* (login, signup, OTP, etc.). It gives
  caching, dedup, retries, and invalidation for free.
- **React Context** (`AuthProvider`) wraps the `me` query and exposes a single,
  ergonomic `useAuth()` to the whole tree — `user`, derived `status`, and the
  auth actions — so components never touch query keys directly.

> TanStack Query is **not yet installed**. Add `@tanstack/react-query` (v5).
> No Redux — consistent with the rest of the frontend, which is repository +
> `Result` + (now) Query.

---

## Provider tree

```tsx
// app/layout.tsx
<ThemeProvider>
  <QueryProvider>        {/* new: QueryClientProvider + a shared QueryClient */}
    <I18nProvider>
      <AuthProvider>     {/* new: runs the `me` query, exposes useAuth() */}
        <AuthModalProvider>  {/* new: controls the auth modal + active view */}
          {children}
        </AuthModalProvider>
      </AuthProvider>
    </I18nProvider>
  </QueryProvider>
</ThemeProvider>
```

`AuthProvider` sits **inside** `QueryProvider` (it uses queries) and **outside**
feature UI (so `useAuth()` is available everywhere, including the header,
guards, and the modal).

---

## Query keys

```ts
export const authKeys = {
  me:       ["auth", "me"] as const,
  sessions: ["auth", "sessions"] as const,
  session:  (id: string) => ["auth", "session", id] as const,
};
```

## The `me` query (single source of truth for the user)

```ts
function useMeQuery() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: () => container.cradle.getOwnProfileUseCase.execute(),  // Result<IAuthUserEntity>
    select: (res) => (res.ok ? res.value : null),
    staleTime: 5 * 60_000,     // navigation doesn't refetch for 5 min
    retry: false,              // a 401 means "guest", not "retry"
  });
}
```

- The use case returns `Result<T>`; `select` unwraps it. A failure (401) yields
  `null` → `guest`.
- `retry: false` so an unauthenticated `me` resolves immediately to guest.

## AuthProvider & useAuth()

```ts
type AuthStatus = "loading" | "guest" | "unverified" | "authenticated";

interface AuthContextValue {
  user: IAuthUserEntity | null;
  status: AuthStatus;
  isAuthenticated: boolean;     // status === "authenticated"
  refetch: () => void;          // re-run the me query
}
```

`status` is **derived**, never stored:

```ts
const status =
  meQuery.isLoading ? "loading"
  : !user           ? "guest"
  : !user.isVerified ? "unverified"
  : "authenticated";
```

Components call `const { user, status, isAuthenticated } = useAuth();` — they
never see query keys or the container.

---

## Mutations (one hook per action)

Each auth action is a TanStack `useMutation` wrapping the matching use case.
On success they invalidate or set `['auth','me']` so the whole app updates.

```ts
function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginInput) => container.cradle.loginUseCase.execute(input),
    onSuccess: (res) => {
      if (res.ok) qc.setQueryData(authKeys.me, ok(res.value.user)); // instant
      else        qc.invalidateQueries({ queryKey: authKeys.me });
    },
  });
}
```

| Hook | Use case | On success |
|---|---|---|
| `useLogin` | login | set/invalidate `me` → modal closes |
| `useSignup` | signup | set `me` (unverified) → go to Verify-OTP view |
| `useVerifyOtp` | verifyOtp | invalidate `me` → user becomes verified |
| `useResendOtp` | resendOtp | start 60s cooldown |
| `useForgotPassword` | forgotPassword | go to Reset view |
| `useResetPassword` | resetPassword | go to Login view |
| `useUpdateProfile` | updateOwnProfile | `setQueryData(me, response.user)` |
| `useUpdateAvatar` | upload avatar | `setQueryData(me, response.user)` |
| `useLogout` | signOut / signOutAll | `qc.clear()` → guest |

The mutation objects expose `isPending`, `error`, etc., which the forms bind to
for loading + error UI.

---

## Keeping the user fresh after profile edits (no stale data)

When the user changes their **username, phone, email, or avatar**, nothing
should ever show the old value. This is guaranteed by two properties, not by
manual bookkeeping:

1. **One entry, one reader.** The user lives only in `['auth','me']`. Every
   component reads it via `useAuth()` — there is no second copy of `username` to
   drift. "Refresh everywhere" therefore means updating exactly one cache entry.
2. **Write the server's response back into that entry.** `PATCH /me/profile`
   and the avatar upload endpoint **return the updated `UserResponseDto`**, so on
   success we write it straight into the cache — authoritative *and* instant, no
   refetch:

```ts
function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input) => container.cradle.updateOwnProfileUseCase.execute(input),
    onSuccess: (res) => {
      if (res.ok) qc.setQueryData(authKeys.me, ok(res.value)); // server's updated user
      else        qc.invalidateQueries({ queryKey: authKeys.me });
    },
  });
}
```

Every `useAuth()` consumer (header avatar, profile, comment byline…) re-renders
with the new values immediately.

### Why SPA navigation isn't stale

Navigation does **not** refetch within `staleTime` — and doesn't need to. The
mutation already wrote the authoritative user into the cache, so the next page
renders fresh. `staleTime` only governs *background* refetch, never correctness
after a write.

### Optional optimistic update (instant feel, safe rollback)

```ts
onMutate: async (input) => {
  await qc.cancelQueries({ queryKey: authKeys.me });
  const prev = qc.getQueryData(authKeys.me);
  qc.setQueryData(authKeys.me, (old) => (old?.ok ? ok({ ...old.value, ...input }) : old));
  return { prev };                                              // snapshot
},
onError: (_e, _v, ctx) => ctx?.prev && qc.setQueryData(authKeys.me, ctx.prev), // rollback
// onSuccess still writes the real server user (above) — reconciles any drift
```

### Avatar — the one cache-busting caveat

`setQueryData` updates `avatar.storageUrl`, but the *image bytes* are cached by
the browser/`next/image` keyed on the **URL**:

- Cloudinary URLs include a version segment (`/v<timestamp>/`) that changes on
  re-upload, so the new picture loads automatically.
- If a storage provider ever returns the **same** URL after overwrite, cache-bust
  with `` `${avatar.storageUrl}?v=${user.updatedAt}` `` so the old image isn't shown.

### Side effects derive for free

If changing the email flips `isVerified` to `false`, the returned user reflects
it, `useAuth().status` re-derives `authenticated → unverified` automatically (it
is computed from `['auth','me']`), and the verify prompt can appear — no extra
wiring.

### When to invalidate instead of set

Use `setQueryData(response.user)` whenever the endpoint returns the full user
(profile + avatar do). Fall back to
`qc.invalidateQueries({ queryKey: authKeys.me })` only for mutations that don't
return the user — it's always correct, at the cost of one refetch.

---

## SSR hydration

To avoid a flash of "guest" before the client `me` query resolves, prefetch on
the server and hydrate:

```tsx
// app/(public)/layout.tsx (server component)
const qc = new QueryClient();
const cradle = await createServerCradle();           // cookie-forwarding client
await qc.prefetchQuery({
  queryKey: authKeys.me,
  queryFn: () => cradle.getOwnProfileUseCase.execute(),
});
return (
  <HydrationBoundary state={dehydrate(qc)}>
    {children}
  </HydrationBoundary>
);
```

The server reads the request's `accessToken` cookie (forwarded by
`createServerApiClient`), so the user is known at first paint.

### Server-side `getCurrentUser()` with caching

The prefetch (and any server component that needs the user) goes through a single
cached `getCurrentUser()`. It is wrapped twice so the backend profile call is
near-free:

- **React `cache()`** — dedupes within one render (e.g. `generateMetadata` and
  the page both ask for the user → one API call).
- **`unstable_cache` (30s TTL)** — dedupes across requests from the same user;
  consecutive page loads within the window hit the Next.js server cache, not the
  backend. The key includes the access token, so users never share cache; a
  profile change is stale for at most 30s.

```ts
// src/shared/infrastructure/auth/get-current-user.ts
import { cache } from "react";
import { cookies } from "next/headers";
import { unstable_cache } from "next/cache";

/**
 * Reads the access-token cookie and resolves the current user from the backend
 * profile endpoint, with per-render (React cache) and per-30s (unstable_cache)
 * caching so a full page load costs at most one backend call.
 *
 * @returns The current user entity, or null when there is no valid session.
 */
export const getCurrentUser = cache(async (): Promise<IAuthUserEntity | null> => {
    const token = (await cookies()).get("accessToken")?.value;
    if (!token) return null;

    const load = unstable_cache(
        async () => {
            const cradle = await createServerCradle();
            const result = await cradle.getOwnProfileUseCase.execute();
            return result.ok ? result.value : null;
        },
        [`auth-me-${token}`],
        { revalidate: 30 },
    );

    return load();
});
```

This is the **web equivalent of the dashboard's `redux-persist`** rehydration —
but with no client storage: the user is re-derived on the server from the cookie
each load, cached for 30s, and injected into the hydrated query cache. No flash
of unauthenticated UI, no `localStorage`, no encryption library, no Redis. If the
profile lookup ever becomes a bottleneck, the backend can add a cached lookup
without touching the frontend.

---

## Cross-tab sync

```ts
// in AuthProvider
useEffect(() => {
  const ch = new BroadcastChannel("auth");
  ch.onmessage = () => queryClient.invalidateQueries({ queryKey: authKeys.me });
  return () => ch.close();
}, []);
// useLogin/useLogout post to the channel after success
```

Logging in/out in one tab refreshes `me` in the others.

---

## QueryClient defaults

```ts
new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false },
    mutations: { retry: 0 },
  },
});
```

A `401` from a normal query is handled by the **refresh interceptor**, not by
Query retries — see [06-api-client-interceptors.md](06-api-client-interceptors.md).

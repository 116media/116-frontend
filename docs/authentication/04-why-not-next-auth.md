# Why Not next-auth (Auth.js)

## The Question

next-auth (now called Auth.js) is the most popular auth library for Next.js. It handles OAuth, sessions, CSRF, and cookies out of the box. Should the 116 frontend use it?

No. Here is the reasoning.

## What next-auth Does

next-auth is designed for apps where the frontend owns the auth layer. It:

- Manages OAuth redirects (Google, Facebook, GitHub, etc.)
- Creates and manages its own session cookie (`next-auth.session-token`)
- Stores sessions in a database or as encrypted JWTs
- Provides `useSession()` hook and `getServerSession()` for auth state
- Handles CSRF protection automatically

## What the 116 Backend Already Does

The 116 backend (built in .NET 9) is a complete auth system:

| Feature | Backend | next-auth |
| --- | --- | --- |
| Email + password login | `POST /api/v1/public/auth/login` | Credentials provider (limited) |
| Signup with OTP verification | `POST /api/v1/public/auth/signup` + `verify-otp` | Not supported |
| Social login (Google, Facebook) | `POST /api/v1/public/auth/social-login` | Built-in OAuth |
| Password reset + change | `forgot-password` + `reset-password` + `change-password` | Not supported |
| JWT access token (short-lived) | HttpOnly cookie, 60 min | Own JWT session |
| JWT refresh token (long-lived) | HttpOnly cookie, 30 days | Not supported natively |
| Token refresh | `POST /api/v1/public/sessions/refresh-token` | Not supported for Credentials |
| Session listing | `GET /api/v1/public/sessions` | Not supported |
| Session revocation | `POST /api/v1/public/sessions/{id}/revoke` | Not supported |
| Sign out all devices | `POST /api/v1/public/auth/sign-out-all` | Not supported |
| Role-based access (RBAC) | SuperAdmin, Admin, Visitor + 28 permissions | Manual via callbacks |
| Account verification status | `isVerified`, `isActive` flags | Not supported |
| Multi-device session management | Full support with device metadata | Not supported |

The backend handles everything. next-auth would duplicate most of it and not support the rest.

## The Conflicts

### Two Session Systems

next-auth creates its own session cookie. The backend creates `accessToken` and `refreshToken` cookies. You end up with three cookies doing overlapping work. When one expires and the other does not, the app enters an inconsistent state where `useSession()` says "authenticated" but the API returns 401, or vice versa.

### Credentials Provider Limitations

next-auth's `Credentials` provider (for email + password) is intentionally limited. From the official docs:

> The functionality provided for credentials-based authentication is intentionally limited to discourage the use of passwords due to the inherent security risks associated with them.

It does not support:
- Refresh tokens
- Session management (list, revoke)
- Multi-step flows (OTP after signup)

You would need to bypass next-auth for most of the auth flow anyway.

### Social Login Collision

The backend's social login flow works like this:

```text
1. Frontend gets OAuth token from Google/Facebook SDK
2. Frontend sends POST /api/v1/public/auth/social-login { provider, token }
3. Backend verifies token with provider, creates/links user
4. Backend sets HttpOnly cookies
5. Frontend reads user from response
```

next-auth's social login flow works like this:

```text
1. next-auth redirects to Google/Facebook
2. Provider redirects back to /api/auth/callback/google
3. next-auth verifies token, creates session
4. next-auth sets its own cookie
```

In next-auth's flow, the backend never sees the social login. The user is created in next-auth's session but not in the 116 backend database. The backend does not know who the user is, what role they have, or what permissions they were assigned.

To bridge this, you would need a custom next-auth adapter that calls the 116 backend on every sign-in. At that point you are writing more glue code than if you just called the backend directly.

### Permission Model

The 116 backend has a granular permission model: resources (articles, videos, comments, bookmarks) combined with actions (read, create, update, delete). Users get permissions through roles. next-auth has no concept of this. You would need custom session callbacks to inject permissions into the session token, and keep them in sync with the backend.

## The Recommended Approach

Use the backend as the single source of truth for auth. The frontend is a thin client:

```text
Frontend                          Backend
--------                          -------
Login form                   -->  POST /auth/login
                             <--  HttpOnly cookies set
                             <--  { user } in response body

getCurrentUser()             -->  GET /users/{id}/profile (with cookie)
                             <--  { user, roles, permissions }

AuthContext provides user to all components

API call with expired token  -->  401 response
Interceptor catches 401      -->  POST /sessions/refresh-token (cookie)
                             <--  New cookies set
Interceptor retries request  -->  Original API call succeeds

Protected route middleware   -->  Read cookie, redirect if missing
```

No next-auth. No second session system. No adapter glue code. One auth layer (the backend), one source of truth.

## When next-auth Would Make Sense

next-auth is the right choice when:

- Your backend is a simple CRUD API with no auth logic
- You want the frontend to own authentication entirely
- You use OAuth exclusively (no email + password)
- You do not need refresh tokens, session management, or device tracking
- You are building a prototype and want auth working in 30 minutes

None of these apply to 116. The backend already has a production-grade auth system. Adding next-auth on top would create complexity without adding value.

## Dependencies Saved

By not using next-auth, you avoid:

- `next-auth` (150KB+ client bundle)
- `@auth/core`
- Database adapter packages
- Custom adapter/callback glue code
- Debugging conflicts between two session systems

The frontend auth implementation is just:

- `AuthProvider.tsx` (React Context, ~30 lines)
- `getCurrentUser()` (server-side cookie read + API call, ~20 lines)
- `middleware.ts` (route protection, ~20 lines)
- Token refresh interceptor (~40 lines)

Total: about 110 lines of straightforward code vs an entire library with adapters and callbacks.

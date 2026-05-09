# Authentication Flow

## Overview

The backend delivers JWT tokens via HttpOnly cookies for web clients. The frontend never sees or stores tokens directly. Both the dashboard and the frontend use the same HttpOnly cookie mechanism for token delivery.

## Login Flow

```text
1. User clicks login button or tries to interact without being logged in
2. Auth modal opens with login form
3. User submits email + password
4. Frontend sends POST /api/v1/public/auth/login
5. Backend validates credentials
6. Backend sets HttpOnly cookies:
   - accessToken (short-lived, ~60 min)
   - refreshToken (long-lived, ~30 days)
7. Backend returns { user: UserResponseDto }
8. Frontend updates AuthContext with user data
9. Auth modal closes
10. User continues where they were (no page redirect)
```

## Token Refresh

```text
1. API call returns 401 (access token expired)
2. Interceptor catches the 401
3. Interceptor sends POST /api/v1/public/sessions/refresh-token
   (refresh token sent automatically via cookie)
4. Backend validates refresh token
5. Backend sets new HttpOnly cookies
6. Interceptor retries the original request
7. If refresh also fails (refresh token expired):
   - Clear AuthContext
   - Open login modal
```

## Social Login

```text
1. User clicks "Continuer avec Google/Facebook"
2. Frontend opens OAuth popup/redirect
3. OAuth provider returns auth code
4. Frontend sends POST /api/v1/public/auth/social-login with provider + code
5. Backend exchanges code for user info
6. Backend creates/links account
7. Backend sets HttpOnly cookies
8. Frontend updates AuthContext with user data
9. Auth modal closes
```

## Sign Up Flow

```text
1. User submits signup form (email, password, username)
2. Frontend sends POST /api/v1/public/auth/signup
3. Backend creates unverified account
4. Backend sends OTP to email
5. Auth modal switches to OTP verification form
6. User enters OTP
7. Frontend sends POST /api/v1/public/auth/verify-otp
8. Backend verifies OTP, marks account as verified
9. Auth modal switches to login form
```

## Auth Context

```typescript
// src/shared/presentation/providers/AuthProvider.tsx
"use client";

import { createContext, useContext } from "react";

interface AuthContextValue {
    user: IUser | null;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue>({
    user: null,
    isAuthenticated: false,
});

export function useAuth() {
    return useContext(AuthContext);
}
```

The user data is fetched in the root layout (Server Component) by reading the cookie and calling the profile API. It is then passed to the AuthProvider as a prop.

## Checking Auth in Server Components

```typescript
// src/shared/infrastructure/auth/get-current-user.ts
import { cookies } from "next/headers";
import { createServerApiClient } from "@/shared/infrastructure/api/server-client";

export async function getCurrentUser(): Promise<IUser | null> {
    const cookieStore = await cookies();
    const hasToken = cookieStore.has("accessToken");

    if (!hasToken) return null;

    try {
        const client = await createServerApiClient();
        const response = await client.api.getOwnProfile();
        return AuthMapper.userFromDto(response.data.user);
    } catch {
        return null;
    }
}
```

## Checking Auth in Client Components

All auth forms (login, signup, forgot password, reset password, OTP) are modals, not pages. A visitor browsing an article should never be navigated away to a login page. They see a modal, log in, and continue reading.

The `AuthDialogProvider` context lets any component trigger the auth modal:

```typescript
"use client";

import { useAuth } from "@/shared/presentation/providers/AuthProvider";
import { useAuthDialog } from "@/shared/presentation/providers/AuthDialogProvider";

function LikeButton({ articleId }: { articleId: string }) {
    const { user } = useAuth();
    const { openAuth } = useAuthDialog();
    const like = useLikeArticle(articleId);

    const handleLike = () => {
        if (!user) {
            openAuth("LOGIN");
            return;
        }
        like.mutate();
    };

    return <button onClick={handleLike}>Like</button>;
}
```

This pattern is used by every interaction button: LikeButton, BookmarkButton, ShareButton, CommentForm, RatingStars, AddToPlaylistButton. All check auth first, show the login modal if needed, perform the action if authenticated.

After a successful login, the mutation updates the AuthProvider context and closes the modal:

```typescript
"use client";

export function useLogin() {
    const { setUser } = useAuth();
    const { closeAuth } = useAuthDialog();

    return useMutation({
        mutationFn: (credentials: ILoginCredentials) =>
            apiClient.api.publicLogin(credentials),
        onSuccess: (response) => {
            setUser(AuthMapper.userFromDto(response.data.user));
            closeAuth();
        },
    });
}
```

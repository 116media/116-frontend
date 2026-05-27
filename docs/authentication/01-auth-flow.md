# Authentication Flow

## Overview

The backend delivers JWT tokens via HttpOnly cookies for web clients. The frontend never sees or stores tokens directly. This is more secure than the dashboard's current approach (which stores tokens in encrypted localStorage).

## Login Flow

```text
1. User submits email + password
2. Frontend sends POST /api/v1/public/auth/login
3. Backend validates credentials
4. Backend sets HttpOnly cookies:
   - accessToken (short-lived, ~60 min)
   - refreshToken (long-lived, ~30 days)
5. Backend returns { user: UserResponseDto }
6. Frontend stores user data in AuthContext
7. Frontend redirects to home page
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
   - Redirect to login
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
8. Frontend stores user in AuthContext
```

## Sign Up Flow

```text
1. User submits signup form (email, password, username)
2. Frontend sends POST /api/v1/public/auth/signup
3. Backend creates unverified account
4. Backend sends OTP to email
5. Frontend redirects to OTP verification page
6. User enters OTP
7. Frontend sends POST /api/v1/public/auth/verify-otp
8. Backend verifies OTP, marks account as verified
9. Frontend redirects to login
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

```typescript
"use client";

import { useAuth } from "@/shared/presentation/providers/AuthProvider";

function LikeButton({ articleId }: { articleId: string }) {
    const { isAuthenticated } = useAuth();
    const like = useLikeArticle(articleId);

    if (!isAuthenticated) {
        return <LoginPromptButton />;
    }

    return <button onClick={() => like.mutate()}>Like</button>;
}
```

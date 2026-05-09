# Form Handling

## When You Need Forms

The frontend has fewer forms than the dashboard. The main forms are:

| Form | Location | Complexity |
| --- | --- | --- |
| Login | Auth modal | Email + password |
| Signup | Auth modal | Email + password + username + country |
| Forgot Password | Auth modal | Email |
| OTP Verification | Auth modal | 6-digit code |
| Reset Password | Auth modal | New password + confirm |
| Comment | Article detail page | Single textarea |
| Search | Header | Single input |
| Profile Edit | `/settings` | Multiple fields |
| Create Playlist | `/playlists` | Name input |

## React Hook Form

Use React Hook Form for forms with validation. It is lightweight (no Redux needed) and integrates well with shadcn/ui.

```bash
yarn add react-hook-form @hookform/resolvers zod
```

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email("Adresse email invalide"),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        const result = await apiClient.api.publicLogin(data);
        // Handle success/error
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && (
                    <p className="text-sm text-error mt-1">{errors.email.message}</p>
                )}
            </div>
            <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" type="password" {...register("password")} />
                {errors.password && (
                    <p className="text-sm text-error mt-1">{errors.password.message}</p>
                )}
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Connexion..." : "Se connecter"}
            </Button>
        </form>
    );
}
```

## Validation with Zod

Define validation schemas that match the backend's FluentValidation rules:

```typescript
// src/modules/auth/presentation/validators/login.schema.ts
import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "L'email est obligatoire")
        .email("Adresse email invalide"),
    password: z
        .string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});
```

## Server-Side Validation Errors

When the backend returns validation errors (400), map them to form field errors:

```typescript
const onSubmit = async (data: LoginFormData) => {
    try {
        await apiClient.api.publicLogin(data);
    } catch (error) {
        const failure = ProblemMapper.toFailure(error);
        if (failure.errors) {
            failure.errors.forEach((err) => {
                setError(err.propertyName.toLowerCase() as keyof LoginFormData, {
                    message: err.errorMessage,
                });
            });
        }
    }
};
```

## Simple Forms Without React Hook Form

For single-field forms (search, comment, playlist name), use plain React state:

```typescript
"use client";

export function CommentForm({ articleId }: { articleId: string }) {
    const [body, setBody] = useState("");
    const postComment = usePostComment(articleId);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!body.trim()) return;
        postComment.mutate(body, {
            onSuccess: () => setBody(""),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Ajouter un commentaire..."
            />
            <Button type="submit" disabled={postComment.isPending}>
                Envoyer
            </Button>
        </form>
    );
}
```

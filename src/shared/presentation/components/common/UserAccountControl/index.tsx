"use client";

import { Button } from "@/shared/presentation/components/ui/Button";
import type { User } from "@/shared/presentation/types/user";
import { getAvatarColor, getInitials } from "@/shared/presentation/utils/avatar";
import { cn } from "@/shared/presentation/utils/cn";
import { UserAvatar } from "../UserAvatar";

interface UserAccountControlProps {
    user?: User | null;
    className?: string;
}

/**
 * UserAccountControl
 *
 * @description
 * Displays either a "Se connecter" button (anonymous state) or a user avatar
 * (authenticated state) in the Header.
 *
 * Anonymous: renders an outline Button that will open the login modal once auth
 * is wired up. The click handler is a no-op placeholder for now.
 *
 * Authenticated: renders a circular avatar showing the user's profile picture
 * if available, falling back to initials derived from the username, or a
 * UserRound icon if neither is available.
 *
 * @param user - The authenticated user, or null for anonymous visitors
 * @param className - Additional classes to merge
 */
const DUMMY_USER: User = {
    id: "1",
    userName: "CoolBeatz",
    image: "https://i.pravatar.cc/150?img=12"
};

export function UserAccountControl({ user = DUMMY_USER, className }: UserAccountControlProps) {
    if (!user) {
        return (
            <Button
                variant="outline"
                className={cn("text-sm font-medium", className)}
                onClick={() => {
                    // TODO: open auth modal with LOGIN context
                }}
            >
                Se connecter
            </Button>
        );
    }

    return (
        <Button
            size="icon"
            type="button"
            variant="ghost"
            aria-label={`Compte de ${user.userName}`}
            className={cn(
                "size-8 rounded-full p-0 text-primary-foreground text-sm font-semibold ring-2 ring-border transition-opacity hover:opacity-90",
                className
            )}
            style={!user.image ? { backgroundColor: getAvatarColor(user.userName) } : undefined}
            onClick={() => {
                // TODO: open user profile dropdown
            }}
        >
            <UserAvatar
                user={user}
                initials={getInitials(user.userName)}
            />
        </Button>
    );
}

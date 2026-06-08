import { UserRound } from "lucide-react";
import Image from "next/image";

import { Avatar, AvatarFallback } from "@/shared/presentation/components/ui/Avatar";
import type { User } from "@/shared/presentation/types/user";

interface UserAvatarProps {
    user: User;
    initials: string;
}

/**
 * UserAvatar
 *
 * @description
 * Renders the visual content inside the authenticated avatar button.
 * Built on the shadcn Avatar primitive (Radix UI) for accessible load-state
 * management and consistent circular clipping.
 *
 * Render priority:
 * 1. Profile picture via next/image (when user.image is set)
 * 2. Pre-computed initials string inside AvatarFallback
 * 3. Generic UserRound icon inside AvatarFallback
 *
 * next/image is used directly inside Avatar root (not AvatarImage) to keep
 * Next.js image optimization — AvatarImage renders a plain img tag.
 *
 * @param user     - The authenticated user
 * @param initials - Pre-computed initials derived from the username
 */
export function UserAvatar({ user, initials }: UserAvatarProps) {
    return (
        <Avatar className="size-9">
            {user.image && (
                <Image
                    src={user.image}
                    alt={user.userName}
                    fill
                    className="object-cover"
                    sizes="36px"
                />
            )}
            <AvatarFallback>
                {initials ? (
                    <span className="text-sm font-medium">{initials}</span>
                ) : (
                    <UserRound size={18} />
                )}
            </AvatarFallback>
        </Avatar>
    );
}

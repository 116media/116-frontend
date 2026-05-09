import { UserRound } from "lucide-react";
import Image from "next/image";

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
 * Shows the profile picture if available, falls back to initials, then
 * falls back to a generic user icon.
 *
 * @param user - The authenticated user
 * @param initials - Pre-computed initials derived from the username
 */
export function UserAvatar({ user, initials }: UserAvatarProps) {
    if (user.image) {
        return (
            <Image
                width={36}
                height={36}
                src={user.image}
                alt={user.userName}
                className="size-full rounded-full object-cover"
            />
        );
    }

    if (initials) return <span>{initials}</span>;
    return <UserRound size={18} />;
}

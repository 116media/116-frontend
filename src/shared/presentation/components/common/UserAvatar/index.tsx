import Image from "next/image";

import { Avatar, AvatarFallback } from "@/shared/presentation/components/ui/Avatar";
import { UserRoundIcon } from "@/shared/presentation/components/ui/Icon";
import { getAvatarColor, getInitials } from "@/shared/presentation/utils/avatar";
import { cn } from "@/shared/presentation/utils/cn";

interface UserAvatarProps {
    size?: number;
    image?: string;
    userName: string;
    className?: string;
}

const DEFAULT_AVATAR_SIZE = 36;

/**
 * UserAvatar
 *
 * @description
 * A self-contained circular user avatar. Renders the profile picture when `image` is
 * set; otherwise a deterministic brand-colored circle (from `getAvatarColor`) with the
 * user's initials (from `getInitials`), falling back to a generic icon when initials
 * are empty. The size is applied inline so any pixel value works (not limited to
 * Tailwind size classes), and the initials/icon scale with it. Built on the shadcn
 * Avatar primitive (Radix UI) for accessible load-state handling and circular clipping.
 *
 * @param userName  - The user's display name (used for the color, initials, and alt text).
 * @param image     - Optional profile picture URL.
 * @param size      - Edge length in pixels (default 36, the previous `size-9`).
 * @param className - Extra classes merged onto the avatar (e.g. a ring).
 */
export function UserAvatar({
    userName,
    image,
    size = DEFAULT_AVATAR_SIZE,
    className
}: UserAvatarProps) {
    const initials = getInitials(userName);

    return (
        <Avatar
            className={cn("shrink-0 text-primary-foreground", className)}
            style={{
                width: size,
                height: size,
                ...(image ? {} : { backgroundColor: getAvatarColor(userName) })
            }}
        >
            {image && (
                <Image
                    fill
                    src={image}
                    alt={userName}
                    className="object-cover"
                    sizes={`${size}px`}
                />
            )}
            <AvatarFallback className="bg-transparent font-semibold">
                {initials ? (
                    <span style={{ fontSize: Math.round(size * 0.4) }}>{initials}</span>
                ) : (
                    <UserRoundIcon size={Math.round(size * 0.5)} />
                )}
            </AvatarFallback>
        </Avatar>
    );
}

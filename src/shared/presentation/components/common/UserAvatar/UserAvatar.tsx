import Image from "next/image";

import { Avatar, AvatarFallback } from "@/shared/presentation/components/ui/Avatar";
import { UserRoundIcon } from "@/shared/presentation/components/ui/Icon";
import { getAvatarColor, getInitials } from "@/shared/presentation/utils/avatar/avatar.utils";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for the UserAvatar component.
 *
 * @interface UserAvatarProps
 * @property {number} [size] - Edge length in pixels; defaults to 36.
 * @property {string} [image] - Optional profile picture URL.
 * @property {string} userName - Display name, used for color, initials, and alt text.
 * @property {string} [className] - Extra classes merged onto the avatar.
 */
export interface UserAvatarProps {
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
 * A self-contained circular user avatar: the profile picture when `image` is set,
 * otherwise a deterministic brand-colored circle with the user's initials (generic
 * icon when empty). The size is applied inline so any pixel value works.
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

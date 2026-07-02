import Image from "next/image";
import { Avatar, AvatarFallback } from "@/shared/presentation/components/ui/Avatar";
import { UserRoundIcon } from "@/shared/presentation/components/ui/Icon";

interface UserAvatarProps {
    userName: string;
    image?: string;
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
 * 1. Profile picture via next/image (when `image` is set)
 * 2. Pre-computed initials string inside AvatarFallback
 * 3. Generic UserRoundIcon icon inside AvatarFallback
 *
 * next/image is used directly inside Avatar root (not AvatarImage) to keep
 * Next.js image optimization — AvatarImage renders a plain img tag.
 *
 * @param userName - The user's display name (used as the image alt text).
 * @param image    - Optional profile picture URL.
 * @param initials - Pre-computed initials derived from the username.
 */
export function UserAvatar({ userName, image, initials }: UserAvatarProps) {
    return (
        <Avatar className="size-9">
            {image && (
                <Image
                    src={image}
                    alt={userName}
                    fill
                    className="object-cover"
                    sizes="36px"
                />
            )}
            <AvatarFallback>
                {initials ? (
                    <span className="text-sm font-medium">{initials}</span>
                ) : (
                    <UserRoundIcon size={18} />
                )}
            </AvatarFallback>
        </Avatar>
    );
}

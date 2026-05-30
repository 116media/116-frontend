import { Colors } from "@/shared/presentation/constants/colors";

const AVATAR_COLORS = [
    Colors.BrandPrimary,
    Colors.BrandSecondary,
    Colors.Success,
    Colors.Warning,
    Colors.Error,
    Colors.Yellow,
    Colors.Link
] as const;

/**
 * getAvatarColor
 *
 * @description
 * Derives a deterministic background color from a username string.
 * Hashes the username and maps it to one of the brand/semantic palette colors
 * so each user always gets the same color across sessions.
 *
 * @param name - The username to hash
 * @returns A hex color string from the brand/semantic palette
 */
export function getAvatarColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/**
 * getInitials
 *
 * @description
 * Extracts up to two uppercase initials from a username.
 *
 * @param name - The username to extract initials from
 * @returns A 1–2 character uppercase string
 */
export function getInitials(name: string): string {
    return name
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
}

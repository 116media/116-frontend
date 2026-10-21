import type { ReactNode } from "react";

import type { AuthStatus } from "@/modules/auth/domain/valueobjects/AuthStatus";
import type { IAuthUserEntity } from "@/shared/domain/entities/IAuthUserEntity";

/**
 * UserAccountControlProps
 *
 * @property className - Extra classes merged onto the control's reserved footprint
 * @property onAction - Fired when the guest button opens the auth modal, so a host
 * surface such as the mobile menu can close itself first
 */
export interface UserAccountControlProps {
    className?: string;
    onAction?: () => void;
}

/**
 * UserAccountControlSlotProps
 *
 * @property className - Extra classes merged onto the slot
 * @property children - The active auth state to overlay on the reserved footprint
 */
export interface UserAccountControlSlotProps {
    className?: string;
    children: ReactNode;
}

/**
 * UserAccountControlMenuProps
 *
 * @property user - The authenticated user backing the avatar and menu
 */
export interface UserAccountControlMenuProps {
    user: IAuthUserEntity;
}

/**
 * AccountControlViewProps
 *
 * @property status - The derived auth status
 * @property user - The resolved user, or null when there is no session
 * @property onAction - Forwarded to the guest button; see UserAccountControlProps
 */
export interface AccountControlViewProps {
    status: AuthStatus;
    user: IAuthUserEntity | null;
    onAction?: () => void;
}

/**
 * UserAccountControlGuestButtonProps
 *
 * @property onAction - Fired before the auth modal opens
 */
export interface UserAccountControlGuestButtonProps {
    onAction?: () => void;
}

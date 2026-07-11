import type { ReactNode } from "react";

import type { AuthStatus } from "@/modules/auth/domain/valueobjects/AuthStatus";
import type { IAuthUserEntity } from "@/shared/domain/entities/IAuthUserEntity";

/**
 * UserAccountControlProps
 *
 * @property className - Extra classes merged onto the control's reserved footprint
 */
export interface UserAccountControlProps {
    className?: string;
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
 */
export interface AccountControlViewProps {
    status: AuthStatus;
    user: IAuthUserEntity | null;
}

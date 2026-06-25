import type { IAuthUser } from "@/modules/auth/domain/entities/IAuthUser";

/**
 * IProfile
 *
 * @description
 * The current user's profile — structurally the authenticated user. Aliased so the
 * settings module reads as "profile" without re-declaring the shape (dashboard parity).
 */
export type IProfile = IAuthUser;

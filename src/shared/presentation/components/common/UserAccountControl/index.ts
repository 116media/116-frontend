import { UserAccountControl as UserAccountControlRoot } from "./UserAccountControl";
import { UserAccountControlGuestButton } from "./UserAccountControl.GuestButton";
import { UserAccountControlMenu } from "./UserAccountControl.Menu";
import { UserAccountControlSlot } from "./UserAccountControl.Slot";

export type { UserAccountControlProps } from "./types";

/**
 * UserAccountControl
 *
 * @description
 * The header's account control: the root resolves the auth state, `.GuestButton` opens the
 * auth sheet, `.Menu` is the signed-in dropdown and `.Slot` reserves their width so the
 * header never reflows while the state resolves.
 */
export const UserAccountControl = {
    Root: UserAccountControlRoot,
    GuestButton: UserAccountControlGuestButton,
    Menu: UserAccountControlMenu,
    Slot: UserAccountControlSlot
} as const;

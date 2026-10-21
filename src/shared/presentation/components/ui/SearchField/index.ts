import { SearchField as SearchFieldRoot } from "./SearchField";
import { SearchFieldClear } from "./SearchField.Clear";
import { SearchFieldIcon } from "./SearchField.Icon";
import { SearchFieldInput } from "./SearchField.Input";
import { SearchFieldTrigger } from "./SearchField.Trigger";

export type {
    SearchFieldClearProps,
    SearchFieldIconProps,
    SearchFieldInputProps,
    SearchFieldProps,
    SearchFieldTriggerProps
} from "./types";

/**
 * SearchField
 *
 * @description
 * Every search surface in the app: `.Root` is the shell, `.Icon` / `.Input` / `.Clear`
 * fill it, and `.Trigger` is the button that stands in for it until its overlay opens.
 * The compound owns the look and the input semantics; what gets searched stays with the
 * caller's own hook.
 */
export const SearchField = {
    Root: SearchFieldRoot,
    Icon: SearchFieldIcon,
    Input: SearchFieldInput,
    Clear: SearchFieldClear,
    Trigger: SearchFieldTrigger
} as const;

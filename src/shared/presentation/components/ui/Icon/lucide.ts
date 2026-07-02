/**
 * Lucide icon re-exports.
 *
 * @description
 * Every `lucide-react` icon used in the app, re-exported under the `<Name>Icon`
 * suffix convention used across this folder. `Loader2` and `Share2` are aliased
 * to `SpinnerIcon` and `ShareIcon`.
 *
 * @remarks
 * The only module that imports from `lucide-react`. Import icons from
 * `@/shared/presentation/components/ui/Icon`, never from `lucide-react`
 * directly, so a rename stays a one-line change here.
 */
export {
    AlertCircle as AlertCircleIcon,
    ArrowLeft as ArrowLeftIcon,
    BadgeCheck as BadgeCheckIcon,
    Calendar as CalendarIcon,
    Check as CheckIcon,
    ChevronDown as ChevronDownIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    ChevronsUpDown as ChevronsUpDownIcon,
    Clock as ClockIcon,
    Crown as CrownIcon,
    Eye as EyeIcon,
    EyeOff as EyeOffIcon,
    Heart as HeartIcon,
    Loader2 as SpinnerIcon,
    MessageSquare as MessageSquareIcon,
    Play as PlayIcon,
    Search as SearchIcon,
    Share2 as ShareIcon,
    Star as StarIcon,
    UserRound as UserRoundIcon,
    XCircle as XCircleIcon
} from "lucide-react";

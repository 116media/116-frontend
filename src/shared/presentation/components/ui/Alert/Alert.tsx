import type { Failure } from "@/shared/domain/failures/failure";
import { AlertCircleIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Props for the Alert component.
 *
 * @interface AlertProps
 * @property {Failure | null | undefined} error - The failure to display, or null to render nothing.
 */
export interface AlertProps {
    error: Failure | null | undefined;
}

/**
 * Alert
 *
 * @description
 * Renders a backend `Failure` (already localized `title` + `detail`) at the top of
 * a form, styled with destructive theme tokens. Renders nothing when there is no
 * error; backend errors surface here, never on individual fields.
 */
export function Alert({ error }: AlertProps) {
    if (!error) return null;
    return (
        <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3"
        >
            <AlertCircleIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
            <div>
                <p className="text-sm font-semibold text-destructive">{error.title}</p>
                {error.detail && (
                    <p className="mt-0.5 text-sm text-destructive/90">{error.detail}</p>
                )}
            </div>
        </div>
    );
}

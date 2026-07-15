import type { ReactNode } from "react";

/**
 * isEmptyData
 *
 * @description
 * Whether the data counts as empty: null/undefined, or an array with no items.
 *
 * @param data - The resolved query data.
 * @returns True when there is nothing to render.
 */
function isEmptyData(data: unknown): boolean {
    if (data == null) return true;
    return Array.isArray(data) && data.length === 0;
}

/**
 * Props for the StateRenderer component.
 *
 * @interface StateRendererProps
 * @template T - The resolved data type (an array or a nullable entity)
 * @property {T} data - The data to render once resolved.
 * @property {boolean} loading - Whether the data is currently loading.
 * @property {boolean} [error] - Whether the query failed.
 * @property {ReactNode} skeleton - Placeholder shown while loading.
 * @property {ReactNode} [errorState] - Content shown on failure (nothing when omitted).
 * @property {ReactNode} [empty] - Content shown for empty data (nothing when omitted).
 * @property {(data: NonNullable<T>) => ReactNode} render - Renders the non-empty data.
 */
export interface StateRendererProps<T> {
    data: T;
    error?: boolean;
    loading: boolean;
    empty?: ReactNode;
    skeleton: ReactNode;
    errorState?: ReactNode;
    render: (data: NonNullable<T>) => ReactNode;
}

/**
 * StateRenderer
 *
 * @description
 * Generic render-props component mapping async data states to the appropriate
 * UI without nested ternaries: skeleton while loading, error state on failure,
 * empty state when the data is null or an empty array, otherwise the render
 * function with the non-null data.
 */
export function StateRenderer<T>({
    data,
    loading,
    error,
    skeleton,
    errorState,
    empty,
    render
}: StateRendererProps<T>): ReactNode {
    if (loading) return skeleton;
    if (error) return errorState ?? null;
    if (isEmptyData(data)) return empty ?? null;
    return render(data as NonNullable<T>);
}

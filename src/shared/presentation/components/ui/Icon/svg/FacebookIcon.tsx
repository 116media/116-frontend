/**
 * FacebookIcon
 *
 * @description
 * Renders the Facebook "f" mark in brand blue as an inline SVG (lucide ships no
 * brand glyphs), used on the Facebook social-login button. Decorative
 * (`aria-hidden`) — the accessible label lives on the button.
 */
export function FacebookIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
            className="size-4"
        >
            <path
                fill="#1877F2"
                d="M24 12a12 12 0 1 0-13.875 11.854v-8.385H7.078V12h3.047V9.356c0-3.007 1.792-4.669 4.533-4.669 1.313 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874V12h3.328l-.532 3.469h-2.796v8.385A12.002 12.002 0 0 0 24 12z"
            />
        </svg>
    );
}

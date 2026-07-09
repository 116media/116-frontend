/**
 * GoogleIcon
 *
 * @description
 * Renders the four-color Google "G" mark as an inline SVG (lucide ships no brand
 * glyphs), used on the Google social-login button. Decorative (`aria-hidden`) — the
 * accessible label lives on the button.
 */
export function GoogleIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
            className="size-4"
        >
            <path
                fill="#4285F4"
                d="M23.06 12.25c0-.86-.08-1.69-.22-2.49H12v4.71h6.2a5.3 5.3 0 0 1-2.3 3.48v2.9h3.72c2.18-2 3.44-4.96 3.44-8.6z"
            />
            <path
                fill="#34A853"
                d="M12 24c3.11 0 5.72-1.03 7.62-2.79l-3.72-2.9c-1.03.69-2.35 1.1-3.9 1.1-3 0-5.54-2.03-6.45-4.75H1.7v2.99A11.5 11.5 0 0 0 12 24z"
            />
            <path
                fill="#FBBC05"
                d="M5.55 14.66A7.1 7.1 0 0 1 5.17 12c0-.92.16-1.82.38-2.66V6.35H1.7A11.5 11.5 0 0 0 .5 12c0 1.86.44 3.62 1.2 5.18l3.85-2.52z"
            />
            <path
                fill="#EA4335"
                d="M12 4.75c1.7 0 3.22.58 4.42 1.72l3.3-3.3C17.7 1.28 15.1.25 12 .25 7.3.25 3.26 2.94 1.7 6.35l3.85 2.99C6.46 6.62 9 4.75 12 4.75z"
            />
        </svg>
    );
}

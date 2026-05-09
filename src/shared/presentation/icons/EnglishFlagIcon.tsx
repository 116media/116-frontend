/**
 * EnglishFlagIcon
 *
 * @description
 * Renders an inline SVG of the United Kingdom flag (Union Jack),
 * used to represent the English language option in the language switcher.
 *
 * @param idPrefix - Unique prefix for clipPath IDs to avoid DOM collisions
 * when multiple instances render on the same page. Defaults to "en".
 */
export function EnglishFlagIcon({ idPrefix = "en" }: { idPrefix?: string } = {}) {
    const sId = `${idPrefix}-s`;
    const tId = `${idPrefix}-t`;

    return (
        <svg
            width={20}
            height={14}
            aria-hidden="true"
            viewBox="0 0 60 40"
            xmlns="http://www.w3.org/2000/svg"
        >
            <clipPath id={sId}>
                <path d="M0,0 v40 h60 v-40 z" />
            </clipPath>
            <clipPath id={tId}>
                <path d="M30,20 h30 v20 z v20 h-30 z h-30 v-20 z v-20 h30 z" />
            </clipPath>
            <g clipPath={`url(#${sId})`}>
                <path
                    d="M0,0 v40 h60 v-40 z"
                    fill="#012169"
                />
                <path
                    d="M0,0 L60,40 M60,0 L0,40"
                    stroke="#fff"
                    strokeWidth="6"
                />
                <path
                    d="M0,0 L60,40 M60,0 L0,40"
                    clipPath={`url(#${tId})`}
                    stroke="#C8102E"
                    strokeWidth="4"
                />
                <path
                    d="M30,0 v40 M0,20 h60"
                    stroke="#fff"
                    strokeWidth="10"
                />
                <path
                    d="M30,0 v40 M0,20 h60"
                    stroke="#C8102E"
                    strokeWidth="6"
                />
            </g>
        </svg>
    );
}

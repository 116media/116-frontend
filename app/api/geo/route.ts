/**
 * Request headers, in priority order, that edge platforms use to expose the caller's
 * country (Vercel, Cloudflare, and a common generic).
 */
const GEO_HEADERS = ["x-vercel-ip-country", "cf-ipcountry", "x-country-code"] as const;

/**
 * normalizeCountryCode
 *
 * @description
 * Validates a value as an ISO 3166-1 alpha-2 country code, rejecting the placeholder
 * codes edge platforms emit for unknown/anonymized IPs (`XX`, `T1`).
 *
 * @param value - The raw header/API value, or null.
 * @returns The upper-cased two-letter code, or null when not a usable country.
 */
function normalizeCountryCode(value: string | null): string | null {
    if (!value) return null;
    const code = value.trim().toUpperCase();
    if (!/^[A-Z]{2}$/.test(code) || code === "XX" || code === "T1") return null;
    return code;
}

/**
 * firstPublicIp
 *
 * @description
 * Extracts the first non-local IP from an `x-forwarded-for`-style header so the country
 * lookup reflects the visitor rather than the loopback address seen in local dev.
 *
 * @param forwarded - The forwarded-for header value, or null.
 * @returns The first public IP, or null when none is present.
 */
function firstPublicIp(forwarded: string | null): string | null {
    if (!forwarded) return null;
    const candidate = forwarded
        .split(",")
        .map((part) => part.trim())
        .find((part) => part && part !== "::1" && part !== "0.0.0.0" && !part.startsWith("127."));
    return candidate ?? null;
}

/**
 * GET /api/geo
 *
 * @description
 * Resolves the caller's country server-side and returns `{ countryCode }` (ISO alpha-2,
 * or null). It uses the edge geo header when present (Vercel/Cloudflare, no external
 * call); otherwise it queries ipwho.is with the visitor's forwarded IP — matching the
 * mobile app's ipwho.is-based detection while keeping the third-party call off the
 * browser. Any failure degrades to `{ countryCode: null }`.
 *
 * @param request - The incoming request, whose headers carry the geo/forwarded data.
 * @returns A JSON response `{ countryCode: string | null }`.
 */
export async function GET(request: Request): Promise<Response> {
    for (const header of GEO_HEADERS) {
        const code = normalizeCountryCode(request.headers.get(header));
        if (code) return Response.json({ countryCode: code });
    }

    const forwarded = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip");
    const ip = firstPublicIp(forwarded);

    try {
        const response = await fetch(ip ? `https://ipwho.is/${ip}` : "https://ipwho.is/", {
            cache: "no-store"
        });
        const data = (await response.json()) as { success?: boolean; country_code?: string };
        const code = data.success ? normalizeCountryCode(data.country_code ?? null) : null;
        return Response.json({ countryCode: code });
    } catch {
        return Response.json({ countryCode: null });
    }
}

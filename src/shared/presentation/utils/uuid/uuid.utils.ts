const BYTE_TO_HEX = Array.from({ length: 256 }, (_, byte) => byte.toString(16).padStart(2, "0"));

/**
 * randomUuid
 *
 * @description
 * A v4 UUID in any browsing context. `crypto.randomUUID` exists only in secure contexts,
 * so a page served over plain http from a LAN address — a phone testing the dev server —
 * does not have it, while `crypto.getRandomValues` is available everywhere and carries the
 * same entropy.
 *
 * @returns The generated UUID.
 */
export function randomUuid(): string {
    if (typeof crypto.randomUUID === "function") return crypto.randomUUID();

    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = Array.from(bytes, (byte) => BYTE_TO_HEX[byte]);
    return [
        hex.slice(0, 4).join(""),
        hex.slice(4, 6).join(""),
        hex.slice(6, 8).join(""),
        hex.slice(8, 10).join(""),
        hex.slice(10, 16).join("")
    ].join("-");
}

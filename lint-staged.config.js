export default {
    "*.{jsx,js,json,css,md,tsx,ts}": "biome check --write",
    "*.{ts,tsx}": [() => "tsc --skipLibCheck --noEmit"]
};

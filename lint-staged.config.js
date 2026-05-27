export default {
    "*.{jsx,js,json,css,tsx,ts}": "biome check --write",
    "*.{ts,tsx}": [() => "tsc --skipLibCheck --noEmit"]
};

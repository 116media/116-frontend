import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const projectRoot = dirname(fileURLToPath(import.meta.url));

/**
 * Where `/backend/*` is forwarded. The browser never names the backend directly, so the app
 * works unchanged on localhost, on whatever LAN address the machine currently holds, and
 * through an https tunnel. Unset is a misconfiguration, not a default to guess at.
 */
const apiOrigin = process.env.API_INTERNAL_URL?.replace(/\/+$/, "");

if (!apiOrigin) {
    throw new Error("API_INTERNAL_URL is required: /backend/* has nowhere to forward to.");
}

const nextConfig: NextConfig = {
    allowedDevOrigins: [
        "*.trycloudflare.com",
        "*.ngrok-free.app",
        "192.168.*.*",
        "10.*.*.*",
        "172.16.*.*"
    ],
    async rewrites() {
        return [{ source: "/backend/:path*", destination: `${apiOrigin}/:path*` }];
    },
    turbopack: {
        root: projectRoot
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "i.pravatar.cc"
            },
            {
                protocol: "https",
                hostname: "images.pexels.com"
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com"
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com"
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com"
            },
            {
                protocol: "https",
                hostname: "www.revolt.tv"
            },
            {
                protocol: "https",
                hostname: "i.ytimg.com"
            }
        ]
    }
};

export default nextConfig;

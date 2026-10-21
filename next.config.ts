import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const projectRoot = dirname(fileURLToPath(import.meta.url));

/**
 * Where the dev proxy forwards `/backend/*`. The browser never names the backend
 * directly, so the app works unchanged on localhost, on whatever LAN address the
 * machine currently holds, and through an https tunnel.
 */
const apiOrigin = (process.env.API_INTERNAL_URL ?? "http://localhost:5025").replace(/\/+$/, "");

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
            }
        ]
    }
};

export default nextConfig;

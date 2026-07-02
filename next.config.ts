import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
                hostname: "res.cloudinary.com"
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com"
            }
        ]
    }
};

export default nextConfig;

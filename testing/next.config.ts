import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    // allowedDevOrigins: ["10.160.51.196"],
    images: {
        remotePatterns: [new URL("https://asprtoarwmujwoqysshz.supabase.co/storage/v1/object/public/**")],
    },
};

export default nextConfig;

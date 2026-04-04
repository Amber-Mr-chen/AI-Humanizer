import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Cloudflare Workers deployment
  experimental: {
    // Enable server actions
  },
};

export default nextConfig;

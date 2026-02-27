import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/cv/[id]", destination: "/cv/[id]", permanent: false },
    ];
  },
};

export default nextConfig;

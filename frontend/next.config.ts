import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/hospitals',
        destination: 'http://localhost:8080/api/hospitals',
      },
    ];
  },
};

export default nextConfig;

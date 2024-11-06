import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{
        hostname:  "utfs.io",
        protocol: "https"
      },
      {
        hostname: "picsum.photos",
        protocol: "https"
      }
     ]
}
};

export default nextConfig;

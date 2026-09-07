import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The public repository is deployed as a static client-side application.
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

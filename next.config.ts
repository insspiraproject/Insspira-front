import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["miro.medium.com"], // agregá aquí todos los dominios que usarás
  },
};

export default nextConfig;

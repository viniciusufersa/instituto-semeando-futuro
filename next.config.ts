import type { NextConfig } from "next";

const githubPagesBasePath = "/instituto-semeando-futuro";
const isGitHubActionsBuild = process.env.GITHUB_ACTIONS === "true";
const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const basePath = isGitHubActionsBuild ? githubPagesBasePath : configuredBasePath;

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;

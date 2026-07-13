/** @type {import('next').NextConfig} */

// GitHub Pages serves a project site from a subpath (/<repo>) and only static
// files. The CI workflow sets GITHUB_PAGES=true so local dev/builds stay at root.
const isPages = process.env.GITHUB_PAGES === "true";
const repo = "cartbliss";

const nextConfig = {
  // Static HTML export -> ./out (required for GitHub Pages).
  output: "export",
  trailingSlash: true,
  basePath: isPages ? `/${repo}` : "",
  assetPrefix: isPages ? `/${repo}/` : "",
  images: {
    // No Image Optimization server on Pages — emit plain <img> with the src.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;

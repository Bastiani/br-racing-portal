/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "traxion.gg",
      },
      {
        protocol: "https",
        hostname: "teamoneil.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  
  // Image optimization with existing remote patterns
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
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Enable compression
  compress: true,
  
  // Keep existing React strict mode
  reactStrictMode: true,
  
  // Security headers for better SEO ranking
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
  
  // Redirect configuration removed to prevent infinite loops
  // Configure redirects at DNS/hosting level instead,
};

module.exports = nextConfig;

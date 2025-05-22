/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/auth/callback',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@gitlumen/core', '@gitlumen/shared'], // CRITICAL for monorepo
  experimental: {
    // Enable if needed
    serverActions: true,
  },
  // Handle CORS for API calls
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig; 
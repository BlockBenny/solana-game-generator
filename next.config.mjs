/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    staticFolder: '/public',
  },
  images: {
    domains: ['localhost'], // Add your production domain here as well
  },
  webpack: (config, { isServer }) => {
    // This allows the app to refer to files through the public directory
    config.resolve.fallback = {
      fs: false,
      path: false,
    };
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/games/:path*',
        destination: '/api/serve-game/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: '/api/serveUploads/:path*',
      },
    ];
  },
};

export default nextConfig;

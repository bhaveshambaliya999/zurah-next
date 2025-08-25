// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "src/assets/sass")],
  },
  webpack: (config, { dev }) => {
    if (!dev) {
      config.plugins = config.plugins.filter(
        (plugin) => plugin.constructor.name !== "ReactFreshWebpackPlugin"
      );
    }
    return config;
  },
  allowedDevOrigins: ['https://uat-direct.rpdiamondsandjewellery.com'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rpdiamondsandjewellery-staging.s3.ap-southeast-1.amazonaws.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig; // ✅ ESM export

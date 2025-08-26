/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  // experimental: {
  //   ppr: true,
  // },
  sassOptions: {
    includePaths: [path.join(process.cwd(), "src/assets/sass"), "node_modules"],
  },
  webpack: (config, { dev, isServer }) => {
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

export default nextConfig;

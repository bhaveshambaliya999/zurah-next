/** @type {import('next').NextConfig} */
// import withBundleAnalyzer from "@next/bundle-analyzer";

// const withAnalyzer = withBundleAnalyzer({
//   enabled: true, 
// });

const imageDomains = [
  'rpdiamondsandjewellery-staging.s3.ap-southeast-1.amazonaws.com',
  'rpdiamondsandjewellery-uat.s3.ap-southeast-1.amazonaws.com',
  'rpdiamondsandjewellery.s3.ap-southeast-1.amazonaws.com',
  'nivoda-images.s3.eu-west-2.amazonaws.com',
  'api.qrserver.com',
  'nivoda-images.s3.amazonaws.com',
  'uq-datastorage.s3.ap-southeast-1.amazonaws.com',
  'nivoda-images.nivodaapi.net',
  'data1.360view.link',
  'uq-datastorage-uat.s3.ap-southeast-1.amazonaws.com'
];

const remotePatterns = imageDomains.map((domain) => ({
  protocol: 'https',
  hostname: domain,
}));

const nextConfig = {
  images: {
    domains: imageDomains,
    remotePatterns,
    formats: ['image/webp', 'image/avif'],
  },
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  experimental: {
    ppr: true,
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      config.plugins = config.plugins.filter(
        (plugin) => plugin.constructor.name !== "ReactFreshWebpackPlugin"
      );
    }
    return config;
  },
  allowedDevOrigins: [
    "https://uat-direct.rpdiamondsandjewellery.com",
  ],
};

export default nextConfig;
// export default withAnalyzer(nextConfig);

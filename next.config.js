/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {},
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },  
};

module.exports = nextConfig;

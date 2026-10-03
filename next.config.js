/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  },
  env: {
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY || 'AIzaSyDL7Hwbc6kMsI520075u7cDAngiolLwTms'
  }
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // use remotePatterns (domains deprecated)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;

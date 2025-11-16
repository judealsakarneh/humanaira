/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude server-side Twilio SDK from client bundle
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle server-side Twilio SDK on the client
      config.resolve.alias = {
        ...config.resolve.alias,
        'twilio': false,
      }
    }
    return config
  },
}

module.exports = nextConfig

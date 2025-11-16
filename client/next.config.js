const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure Turbopack for Next.js 16
  turbopack: {
    // Set root to parent directory where node_modules exists
    root: path.resolve(__dirname, '..'),
  },
  
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

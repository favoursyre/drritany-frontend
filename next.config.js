/** @type {import('next').NextConfig} */
const path = require("path")

//This initializes the bundle analyzer
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true', // Conditional trigger
  openAnalyzer: true, // Auto-opens the report in your browser
});

const nextConfig = withBundleAnalyzer({
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'drive.google.com'
        },
        {
          protocol: 'https',
          hostname: 'files.edgestore.dev'
        },
        {
          protocol: 'https',
          hostname: 'flagcdn.com'
        },
        {
          protocol: 'https',
          hostname: 'www.gravatar.com'
        }
      ],
        //formats: ['image/svg+xml'],
        dangerouslyAllowSVG: true,
      },
      webpack: (config, { isServer }) => {
        if (!isServer) {
          config.resolve.fallback.fs = false
          config.resolve.fallback.tls = false
          config.resolve.fallback.net = false
          config.resolve.fallback.child_process = false
        }
    
        return config
      },
      // resolve: {
      //   alias: {
      //     style: path.resolve(__dirname, '.', 'style')
      //   }
      // },
      // experimental: {
      //   missingSuspenseWithCSRBailout: false,
      // },
});

module.exports = nextConfig;

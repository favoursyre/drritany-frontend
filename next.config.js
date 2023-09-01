/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        domains: ['drive.google.com'],
        //formats: ['image/svg+xml'],
        dangerouslyAllowSVG: true,
      },
};

module.exports = nextConfig;

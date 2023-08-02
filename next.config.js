/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        // FROM https://github.com/vercel/next.js/issues/42641#issuecomment-1615901228
        './node_modules/@swc/core-linux-x64-gnu',
        './node_modules/@swc/core-linux-x64-musl',
      ],
    },
  },
  images: {
    domains: ['fifty-runs-files.s3.fr-par.scw.cloud'],
  },
};

module.exports = nextConfig;

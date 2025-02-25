/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'fifty-runs-files.s3.fr-par.scw.cloud',
      'ccqov2xqivigvtrz.public.blob.vercel-storage.com',
      'wt2duksjvdyzu9rt.public.blob.vercel-storage.com',
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
};

module.exports = nextConfig;

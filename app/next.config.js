/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'fifty-runs-files.s3.fr-par.scw.cloud',
      'ccqov2xqivigvtrz.public.blob.vercel-storage.com',
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
};

module.exports = nextConfig;

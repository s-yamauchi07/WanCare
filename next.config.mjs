/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pfimuflcbqjequgvacmg.supabase.co',
      },
    ],
  },
};

export default nextConfig;

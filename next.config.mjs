/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';

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

export default withPWA({
  dest: 'public',
})(nextConfig);
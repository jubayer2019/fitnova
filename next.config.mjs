/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // Fallback to localhost if env is missing, but on Vercel it should route to the backend
        destination: `${process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "") : 'http://localhost:5000'}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

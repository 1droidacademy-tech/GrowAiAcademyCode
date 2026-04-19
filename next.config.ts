import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "pg"],
  async redirects() {
    return [
      {
        source: '/contact',
        destination: '/contact-ai-course',
        permanent: true,
      },
      {
        source: '/course/:id',
        destination: '/ai-course-for-school-students/:id',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;

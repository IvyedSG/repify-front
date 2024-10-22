/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '', // Puedes dejar esto vacío si no hay un puerto específico.
        pathname: '/**', // Esto permite todas las rutas dentro del dominio.
      },
    ],
  },
};

module.exports = nextConfig;

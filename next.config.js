/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Habilita el modo estricto de React
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
  // Permite la configuración de los encabezados
  async headers() {
    return [
      {
        source: '/(.*)', // Aplicar a todas las rutas
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Previene ataques de clickjacking
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // Previene el tipo de contenido MIME sniffing
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload', // Habilita HSTS
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

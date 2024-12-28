

// Define the configuration object
const nextConfig = {
  reactStrictMode: true, // Enables React strict mode
  images: {
    domains: ['example.com'], // Allow images from specific domains
  },
  i18n: {
    locales: ['en', 'km'],    // Supported locales
    defaultLocale: 'en',      // Default locale
  },
 
  httpAgentOptions: {
    keepAlive: false,
  },






};

// Export the configuration
export default nextConfig;



// Define the configuration object
const nextConfig = {
  reactStrictMode: true, // Enables React strict mode

  i18n: {
    locales: ['en', 'km'],    // Supported locales
    defaultLocale: 'en',      // Default locale
  },
 
  httpAgentOptions: {
    keepAlive: false,
  },

  //swcMinify: false,



};

// Export the configuration
export default nextConfig;

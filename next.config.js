const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ["racksmarketplace.onrender.com", "via.placeholder.com"],
    },
    experimental: {
        appDir: false, // Ensure it's using the Pages Router
    },
};

module.exports = nextConfig;

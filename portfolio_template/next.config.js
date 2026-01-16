// module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
	compress: true,
	reactStrictMode: true,
	poweredByHeader: false,
	experimental: {
		scrollRestoration: true,
		// webVitalsAttribution: ["CLS", "LCP"],
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "wisherpro.com",
				pathname: "/**",
			},
		],
		deviceSizes: [320, 420, 768, 1024, 1200, 1400, 1600], // deice sizes for responsive images
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 700, 1024], // sizes for image optimization
	},
};

module.exports = nextConfig;

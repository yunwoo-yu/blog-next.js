import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import createMDX from '@next/mdx';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
	async redirects() {
		return [
			{
				source: '/portfolio/ai-chatbot-ssr',
				destination: '/portfolio/ai-chatbot-cms',
				statusCode: 308,
			},
		];
	},
	images: {
		formats: ['image/avif', 'image/webp'], // default: ['image/webp']
	},
	experimental: {
		viewTransition: true,
	},
	turbopack: {
		root: __dirname,
	},
};

const withMDX = createMDX({
	// Add markdown plugins here, as desired
	extension: /\.mdx?$/,
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);

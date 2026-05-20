import createMDX from '@next/mdx';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
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

import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
	images: {
		formats: ['image/avif', 'image/webp'], // default: ['image/webp']
	},
};

const withMDX = createMDX({
	// Add markdown plugins here, as desired
	extension: /\.mdx?$/,
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);

import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
	// Configure `pageExtensions` to include markdown and MDX files
	pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
	output: 'export',
	unoptimized: true,
	trailingSlash: true,
	// skipTrailingSlashRedirect: true,
	assetPrefix: '.',
	// Optionally, add any other Next.js config below
};

const withMDX = createMDX({
	// Add markdown plugins here, as desired
	extension: /\.mdx?$/,
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);

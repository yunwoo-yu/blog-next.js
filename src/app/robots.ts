import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: ['/career', '/resume'],
		},
		sitemap: 'https://ycow-dev.com/sitemap.xml',
	};
}

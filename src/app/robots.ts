import type { MetadataRoute } from 'next';

import { BASE_URL, RESUME_PATH } from '@/constant';

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: ['/career', RESUME_PATH],
		},
		sitemap: `${BASE_URL}/sitemap.xml`,
	};
}

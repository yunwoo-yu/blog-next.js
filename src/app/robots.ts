import type { MetadataRoute } from 'next';

import { BASE_URL, CAREER_PATH, RESUME_PATH } from '@/constant';

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: [CAREER_PATH, RESUME_PATH],
		},
		sitemap: `${BASE_URL}/sitemap.xml`,
	};
}

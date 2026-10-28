import type { MetadataRoute } from 'next';

import { BASE_URL, CAREER_PATH } from '@/constant';

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			// /resume 은 막지 않는다. 크롤러가 페이지의 noindex 메타를 읽어야 색인에서 빠진다.
			disallow: [CAREER_PATH],
		},
		sitemap: `${BASE_URL}/sitemap.xml`,
	};
}

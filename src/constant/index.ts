import type { Metadata } from 'next';
import type { Author } from 'next/dist/lib/metadata/types/metadata-types';

export const BASE_URL = 'https://ycow-dev.com';

// 프로필 이름을 한글로 바꾸면 LinkedIn 공개 URL 슬러그도 따라 바뀐다.
// 뒤 식별자(65095b263)는 그대로이므로 같은 프로필이다.
export const LINKEDIN_URL = 'https://www.linkedin.com/in/%EC%9C%A4%EC%9A%B0-%EC%9C%A0-65095b263/';

export const GITHUB_URL = 'https://github.com/yunwoo-yu';

// METADATA
export const META_TITLE = 'Ycow FE Dev Blog';
export const META_DESCRIPTION = '프론트엔드 개발자 Ycow의 개발 블로그 입니다.';
export const META_AUTHOR_NAME = '유윤우';
const META_APPLICATION_NAME = 'Ycow Dev Blog';
const META_AUTHOR: Author[] = [{ name: META_AUTHOR_NAME, url: LINKEDIN_URL }];
const META_GENERATOR = 'Next.js + Typescript';
const META_KEYWORDS = ['Front-End', 'Developer', 'Blog', 'Next.js', 'React.js', 'Typescript'];
const META_REFERRER = 'origin';
const META_CREATOR = META_AUTHOR_NAME;
const META_PUBLISHER = META_AUTHOR_NAME;
const META_CATEGORY = 'Blog';

export const ROOT_META_DATA: Metadata = {
	// 없으면 OG/트위터 이미지가 localhost 기준으로 해석되어 공유 썸네일이 깨진다.
	metadataBase: new URL(BASE_URL),
	title: META_TITLE,
	description: META_DESCRIPTION,
	applicationName: META_APPLICATION_NAME,
	authors: META_AUTHOR,
	generator: META_GENERATOR,
	keywords: META_KEYWORDS,
	referrer: META_REFERRER,
	creator: META_CREATOR,
	publisher: META_PUBLISHER,
	category: META_CATEGORY,
	// canonical은 여기 두지 않는다. 루트에 두면 /privacy 같은 하위 페이지까지 상속받아
	// 서로 다른 페이지가 같은 정규 URL을 가리키는 잘못된 중복 신호가 된다.
	alternates: {
		types: { 'application/rss+xml': [{ url: '/feed.xml', title: META_TITLE }] },
	},
	verification: {
		google: 'ax_0fwy0VtSqLoetzvw8ap6chPh_IIt5WbYLSKJYlCA',
		other: {
			'naver-site-verification': 'e38c31efbed18a8c733106f790f2a1bc92fdda3b',
		},
	},
	openGraph: {
		title: META_TITLE,
		description: META_DESCRIPTION,
		type: 'website',
		locale: 'ko_KR',
		siteName: META_APPLICATION_NAME,
		images: ['/images/og_thumbnail.png'],
	},
	twitter: {
		card: 'summary_large_image',
		title: META_TITLE,
		description: META_DESCRIPTION,
		creator: '@Ycow',
		images: ['/images/og_thumbnail.png'],
	},
};

export const WEB_PATH = {
	POSTS: {
		path: () => '/blog/posts',
		label: 'Posts',
	},
};

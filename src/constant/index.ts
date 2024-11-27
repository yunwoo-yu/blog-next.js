import { Metadata } from 'next';
import { Author } from 'next/dist/lib/metadata/types/metadata-types';

export const LINKEDIN_URL = 'https://www.linkedin.com/in/yunwoo-yu-65095b263';

export const GITHUB_URL = 'https://github.com/yunwoo-yu';

// METADATA
const META_TITLE = 'Ycow FE Dev Blog';
const META_DESCRIPTION = '프론트엔드 개발자 Ycow의 개발 블로그 입니다.';
const META_APPLICATION_NAME = 'Ycow Dev Blog';
const META_AUTHOR: Author[] = [{ name: '유윤우', url: LINKEDIN_URL }];
const META_GENERATOR = 'Next.js + Typescript';
const META_KEYWORDS = ['Front-End', 'Developer', 'Blog', 'Next.js', 'React.js', 'Typescript'];
const META_REFERRER = 'origin';
const META_CREATOR = '유윤우';
const META_PUBLISHER = 'AWS';
const META_CATEGORY = 'Front-End Development Blog';

export const ROOT_META_DATA: Metadata = {
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
	openGraph: {
		title: META_TITLE,
		description: META_DESCRIPTION,
		type: 'website',
		locale: 'ko_KR',
		siteName: META_APPLICATION_NAME,
		images: ['/images/og_thumbnail.png'],
	},
};

import { Metadata } from 'next';

export const LINKEDIN_URL = 'https://www.linkedin.com/in/yunwoo-yu-65095b263';

export const GITHUB_URL = 'https://github.com/yunwoo-yu';

export const ROOT_META_DATA: Metadata = {
	title: 'Ycow FE Dev Blog',
	description: '프론트엔드 개발자 Ycow의 개발 블로그 입니다.',
	applicationName: 'Ycow Dev Blog',
	authors: [{ name: '유윤우', url: LINKEDIN_URL }],
	generator: 'Next.js + Typescript',
	keywords: ['Front-End', 'Developer', 'Blog', 'Next.js', 'React.js', 'Typescript'],
	referrer: 'origin',
	creator: '유윤우',
	publisher: 'Vercel',
	category: 'Front-End Development Blog',
};

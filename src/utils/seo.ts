import { BASE_URL, META_AUTHOR_NAME, META_TITLE } from '@/constant';
import type { PostListTypes } from '@/types/common.types';

export const buildPostPath = (category: string, slug: string) => `/blog/posts/${category}/${slug}`;

/**
 * Next.js는 페이지가 alternates를 정의하면 루트의 alternates를 통째로 대체한다.
 * canonical만 적으면 RSS 링크가 사라지므로 항상 이 헬퍼로 함께 넘긴다.
 */
export const buildAlternates = (canonical: string) => ({
	canonical,
	types: { 'application/rss+xml': [{ url: '/feed.xml', title: META_TITLE }] },
});

export const buildAbsoluteUrl = (path: string) => `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

export const escapeXml = (value: string) =>
	value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');

interface BlogPostingParams {
	title: string;
	description: string;
	createdAt: string;
	category: string;
	slug: string;
	thumbnail?: string;
	tags?: string[];
}

export const buildBlogPostingJsonLd = ({
	title,
	description,
	createdAt,
	category,
	slug,
	thumbnail,
	tags,
}: BlogPostingParams) => {
	const url = buildAbsoluteUrl(buildPostPath(category, slug));

	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: title,
		description,
		datePublished: createdAt,
		dateModified: createdAt,
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		url,
		image: thumbnail ? buildAbsoluteUrl(thumbnail) : undefined,
		keywords: tags?.length ? tags.join(', ') : undefined,
		articleSection: category,
		inLanguage: 'ko-KR',
		author: { '@type': 'Person', name: META_AUTHOR_NAME, url: BASE_URL },
		publisher: { '@type': 'Person', name: META_AUTHOR_NAME, url: BASE_URL },
	};
};

export const buildBreadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
	'@context': 'https://schema.org',
	'@type': 'BreadcrumbList',
	itemListElement: items.map((item, index) => ({
		'@type': 'ListItem',
		position: index + 1,
		name: item.name,
		item: buildAbsoluteUrl(item.path),
	})),
});

export const buildBlogJsonLd = (posts: PostListTypes[]) => ({
	'@context': 'https://schema.org',
	'@type': 'Blog',
	name: META_TITLE,
	url: buildAbsoluteUrl('/blog/posts'),
	inLanguage: 'ko-KR',
	author: { '@type': 'Person', name: META_AUTHOR_NAME, url: BASE_URL },
	blogPost: posts.map(post => ({
		'@type': 'BlogPosting',
		headline: post.frontmatter.title,
		datePublished: post.frontmatter.createdAt,
		url: buildAbsoluteUrl(buildPostPath(post.category, post.slug)),
	})),
});

export const buildRssXml = (posts: PostListTypes[], description: string) => {
	const items = posts
		.map(post => {
			const url = buildAbsoluteUrl(buildPostPath(post.category, post.slug));

			return [
				'\t\t<item>',
				`\t\t\t<title>${escapeXml(post.frontmatter.title)}</title>`,
				`\t\t\t<link>${escapeXml(url)}</link>`,
				`\t\t\t<guid isPermaLink="true">${escapeXml(url)}</guid>`,
				`\t\t\t<description>${escapeXml(post.frontmatter.description)}</description>`,
				`\t\t\t<category>${escapeXml(post.category)}</category>`,
				`\t\t\t<pubDate>${new Date(post.frontmatter.createdAt).toUTCString()}</pubDate>`,
				'\t\t</item>',
			].join('\n');
		})
		.join('\n');

	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
		'\t<channel>',
		`\t\t<title>${escapeXml(META_TITLE)}</title>`,
		`\t\t<link>${escapeXml(BASE_URL)}</link>`,
		`\t\t<description>${escapeXml(description)}</description>`,
		'\t\t<language>ko-KR</language>',
		`\t\t<atom:link href="${escapeXml(buildAbsoluteUrl('/feed.xml'))}" rel="self" type="application/rss+xml"/>`,
		items,
		'\t</channel>',
		'</rss>',
	].join('\n');
};

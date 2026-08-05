import { BASE_URL } from '@/constant';
import type { PostListTypes } from '@/types/common.types';

import { buildBlogPostingJsonLd, buildBreadcrumbJsonLd, buildRssXml, escapeXml } from './seo';

const createPost = (overrides: Partial<PostListTypes['frontmatter']> = {}): PostListTypes => ({
	category: 'next',
	slug: 'blog',
	frontmatter: {
		title: '제목',
		createdAt: '2025-01-02',
		thumbnail: '/images/next/blog/thumbnail.png',
		description: '설명',
		tags: ['Next.js'],
		...overrides,
	},
});

describe('escapeXml', () => {
	it('XML 예약 문자를 엔티티로 바꾼다', () => {
		expect(escapeXml(`<a href="x">A & B's</a>`)).toBe('&lt;a href=&quot;x&quot;&gt;A &amp; B&apos;s&lt;/a&gt;');
	});

	it('앰퍼샌드를 먼저 치환해 이중 이스케이프가 나지 않는다', () => {
		expect(escapeXml('&lt;')).toBe('&amp;lt;');
	});
});

describe('buildBlogPostingJsonLd', () => {
	const jsonLd = buildBlogPostingJsonLd({
		title: 'loading.tsx',
		description: '설명',
		createdAt: '2026-04-04',
		category: 'next',
		slug: 'loading_vs_suspense',
		thumbnail: '/images/next/loading_vs_suspense/thumbnail.png',
		tags: ['Next.js', 'React'],
	});

	it('BlogPosting 타입과 절대 URL을 갖는다', () => {
		expect(jsonLd['@type']).toBe('BlogPosting');
		expect(jsonLd.url).toBe(`${BASE_URL}/blog/posts/next/loading_vs_suspense`);
		expect(jsonLd.image).toBe(`${BASE_URL}/images/next/loading_vs_suspense/thumbnail.png`);
	});

	it('태그를 keywords 문자열로 합친다', () => {
		expect(jsonLd.keywords).toBe('Next.js, React');
	});

	it('썸네일과 태그가 없으면 해당 필드를 비운다', () => {
		const minimal = buildBlogPostingJsonLd({
			title: 'T',
			description: 'D',
			createdAt: '2025-01-01',
			category: 'cs',
			slug: 'x',
		});

		expect(minimal.image).toBeUndefined();
		expect(minimal.keywords).toBeUndefined();
	});
});

describe('buildBreadcrumbJsonLd', () => {
	it('순서대로 position을 1부터 매긴다', () => {
		const jsonLd = buildBreadcrumbJsonLd([
			{ name: '홈', path: '/blog/posts' },
			{ name: 'next', path: '/blog/posts/next' },
		]);

		expect(jsonLd.itemListElement).toEqual([
			{ '@type': 'ListItem', position: 1, name: '홈', item: `${BASE_URL}/blog/posts` },
			{ '@type': 'ListItem', position: 2, name: 'next', item: `${BASE_URL}/blog/posts/next` },
		]);
	});
});

describe('buildRssXml', () => {
	it('채널 메타와 self 링크를 포함한다', () => {
		const xml = buildRssXml([createPost()], '블로그 설명');

		expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
		expect(xml).toContain(`<atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>`);
		expect(xml).toContain('<language>ko-KR</language>');
	});

	it('글마다 item과 절대 링크를 만든다', () => {
		const xml = buildRssXml([createPost()], '블로그 설명');

		expect(xml).toContain(`<link>${BASE_URL}/blog/posts/next/blog</link>`);
		expect(xml).toContain(`<guid isPermaLink="true">${BASE_URL}/blog/posts/next/blog</guid>`);
	});

	it('pubDate를 RFC-822 형식으로 변환한다', () => {
		const xml = buildRssXml([createPost({ createdAt: '2025-01-02' })], '설명');

		expect(xml).toContain('<pubDate>Thu, 02 Jan 2025 00:00:00 GMT</pubDate>');
	});

	it('제목의 특수문자를 이스케이프한다', () => {
		const xml = buildRssXml([createPost({ title: 'A & B <c>' })], '설명');

		expect(xml).toContain('<title>A &amp; B &lt;c&gt;</title>');
	});

	it('글이 없어도 유효한 rss 껍데기를 만든다', () => {
		const xml = buildRssXml([], '설명');

		expect(xml).toContain('<rss version="2.0"');
		expect(xml).toContain('</rss>');
		expect(xml).not.toContain('<item>');
	});
});

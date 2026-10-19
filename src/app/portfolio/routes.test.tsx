// @vitest-environment jsdom

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen } from '@testing-library/react';

import { PORTFOLIO_CASES } from '@/portfolio/cases';
import ResumePage, { metadata as resumeMetadata } from '../resume/page';
import robots from '../robots';
import sitemap from '../sitemap';
import CasePage, { dynamicParams, generateMetadata, generateStaticParams } from './[slug]/page';
import PortfolioPage, { metadata } from './page';

const jsonLdOf = (container: HTMLElement) =>
	Array.from(container.querySelectorAll('script[type="application/ld+json"]')).map(node =>
		JSON.parse(node.textContent ?? ''),
	);

describe('/portfolio', () => {
	it('색인 가능하고 canonical 과 OG 이미지를 가진다', () => {
		expect(metadata.robots).toMatchObject({ index: true });
		expect(metadata.alternates?.canonical).toBe('/portfolio');
		expect(metadata.openGraph?.images).toBeDefined();
	});

	it('ProfilePage 와 BreadcrumbList JSON-LD 를 낸다', () => {
		const { container } = render(<PortfolioPage />);
		const types = jsonLdOf(container).map(data => data['@type']);

		expect(types).toEqual(['ProfilePage', 'BreadcrumbList']);
	});

	it('광고 슬롯이 없다', () => {
		const { container } = render(<PortfolioPage />);

		expect(container.querySelector('ins.adsbygoogle')).toBeNull();
	});
});

describe('/portfolio/[slug]', () => {
	it('모든 사례를 정적 경로로 만들고 그 밖의 slug 는 생성하지 않는다', () => {
		expect(generateStaticParams()).toEqual(PORTFOLIO_CASES.map(item => ({ slug: item.slug })));
		expect(dynamicParams).toBe(false);
	});

	it('기존 아바타 사례 URL 도 [slug] 가 같은 canonical 로 맡고 별도 route 를 두지 않는다', async () => {
		const meta = await generateMetadata({ params: Promise.resolve({ slug: 'avatar-studio-performance' }) });

		expect(meta.alternates?.canonical).toBe('/portfolio/avatar-studio-performance');
		expect(meta.robots).toMatchObject({ index: true });
		expect(existsSync(resolve(__dirname, 'avatar-studio-performance'))).toBe(false);

		const ui = await CasePage({ params: Promise.resolve({ slug: 'avatar-studio-performance' }) });
		const { container } = render(ui);
		expect(jsonLdOf(container).map(data => data['@type'])).toEqual(['CreativeWork', 'BreadcrumbList']);
		expect(screen.getByRole('heading', { level: 2, name: '아바타 스튜디오 성능 개선' })).toBeInTheDocument();
		expect(container.querySelector('canvas')).toBeNull();
	});

	it('사례마다 색인 가능한 메타데이터와 고유 canonical 을 낸다', async () => {
		for (const item of PORTFOLIO_CASES) {
			const meta = await generateMetadata({ params: Promise.resolve({ slug: item.slug }) });

			expect(meta.title).toBe(item.title);
			expect(meta.description).toBe(item.summary);
			expect(meta.robots).toMatchObject({ index: true });
			expect(meta.alternates?.canonical).toBe(`/portfolio/${item.slug}`);
		}
	});

	it('없는 slug 의 메타데이터는 비워 500 대신 404 로 가게 한다', async () => {
		expect(await generateMetadata({ params: Promise.resolve({ slug: 'missing' }) })).toEqual({});
	});

	it('없는 slug 는 notFound 를 던진다', async () => {
		await expect(CasePage({ params: Promise.resolve({ slug: 'missing' }) })).rejects.toThrow();
	});

	it('사례 페이지가 CreativeWork 와 BreadcrumbList JSON-LD 를 낸다', async () => {
		const ui = await CasePage({ params: Promise.resolve({ slug: PORTFOLIO_CASES[0].slug }) });
		const { container } = render(ui);

		expect(jsonLdOf(container).map(data => data['@type'])).toEqual(['CreativeWork', 'BreadcrumbList']);
		expect(container.querySelector('ins.adsbygoogle')).toBeNull();
	});
});

describe('sitemap / robots', () => {
	it('포트폴리오와 모든 사례를 사이트맵에 넣고 /resume 은 넣지 않는다', async () => {
		const urls = (await sitemap()).map(entry => entry.url);

		expect(urls).toContain('https://ycow-dev.com/portfolio');
		for (const item of PORTFOLIO_CASES) expect(urls).toContain(`https://ycow-dev.com/portfolio/${item.slug}`);
		expect(urls.some(url => url.includes('/resume'))).toBe(false);
	});

	it('robots 는 /resume 을 막고 /portfolio 는 막지 않는다', () => {
		const rules = robots().rules as { disallow: string[] };

		expect(rules.disallow).toContain('/resume');
		expect(rules.disallow.some(path => '/portfolio'.startsWith(path))).toBe(false);
	});
});

describe('/resume', () => {
	it('noindex 를 유지한다', () => {
		expect(resumeMetadata.robots).toMatchObject({ index: false, follow: false });
	});

	it('모바일 차단 안내 없이 이력서 본문을 렌더한다', () => {
		const { container } = render(<ResumePage />);

		expect(container.textContent).not.toContain('모바일 환경은 지원하지 않습니다');
		expect(container.querySelector('.hidden.md\\:block')).toBeNull();
		expect(screen.getByRole('heading', { name: '경력' })).toBeInTheDocument();
	});
});

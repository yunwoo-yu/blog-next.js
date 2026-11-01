// @vitest-environment jsdom

import { fireEvent, render, screen, within } from '@testing-library/react';

import PortfolioPrintPage, { metadata } from '@/app/portfolio/print/page';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import { META_AUTHOR_NAME } from '@/constant';
import RESUME from '@/constant/resume';
import { EXAMPLE_NOTICE, getExampleScreen } from '@/portfolio/examples';
import { getPortfolioExperience, PORTFOLIO_KEY_RESULTS } from '@/portfolio/overview';
import {
	getPrintContacts,
	getPrintFeatured,
	getPrintOthers,
	getPrintReferences,
	getPrintSkills,
	getTotalCareerDuration,
	PRINT_FEATURED_SLUGS,
	PRINT_FOOTER_LABEL,
	PRINT_IDENTITY_CLAIM,
	PRINT_MAX_DIAGRAM_STEPS,
	PRINT_MAX_TROUBLES,
	PRINT_PORTFOLIO_URL,
	PRINT_TITLE,
} from '@/portfolio/print';

import PortfolioTopBar from './PortfolioTopBar';
import PrintButton from './PrintButton';

const pageOf = (container: HTMLElement, kind: string, slug?: string) =>
	(slug
		? (container.querySelector(`[data-print-case="${slug}"]`) as HTMLElement)
		: container
	).querySelector<HTMLElement>(`[data-print-page="${kind}"]`) as HTMLElement;

describe('/portfolio/print', () => {
	it('noindex 이고 파일 제목이 정해져 있다', () => {
		expect(metadata.robots).toMatchObject({ index: false });
		expect(metadata.title).toBe(PRINT_TITLE);
	});

	it('퇴사 사유는 인쇄 문서 어디에도 나오지 않는다', () => {
		const { container } = render(<PortfolioPrintPage />);
		const exitReasons = RESUME.careers.flatMap(career => career.exitReason ?? []);

		expect(exitReasons.length).toBeGreaterThan(0);
		for (const reason of exitReasons) expect(container.textContent).not.toContain(reason);
	});

	it('꼬리말 문구는 상수에서 만든 @page 규칙으로 들어간다', () => {
		const { container } = render(<PortfolioPrintPage />);
		const style = container.querySelector('style') as HTMLStyleElement;

		expect(style.textContent).toContain(JSON.stringify(PRINT_FOOTER_LABEL));
	});

	it('묶음 마커가 표지 1 + 사례 5 + 그 밖의 작업 1 이고, 사례 안을 강제로 쪽 나누지 않는다', () => {
		const { container } = render(<PortfolioPrintPage />);
		const pages = Array.from(container.querySelectorAll<HTMLElement>('[data-print-page]')).map(
			el => el.dataset.printPage,
		);

		expect(pages).toEqual(['cover', ...PRINT_FEATURED_SLUGS.map(() => 'case'), 'others']);
		expect(
			Array.from(container.querySelectorAll<HTMLElement>('[data-print-case]')).map(el => el.dataset.printCase),
		).toEqual([...PRINT_FEATURED_SLUGS]);
		for (const article of container.querySelectorAll('[data-print-case]')) {
			// 사례는 새 쪽에서 시작하고(묶음 하나), 안쪽에는 쪽 나눔이 없다. 내용만큼 흐르도록 인쇄 최소 높이를 끈다.
			const sheets = article.querySelectorAll('[data-print-page]');

			expect(sheets).toHaveLength(1);
			expect(sheets[0].className).toContain('print:break-before-page');
			expect(sheets[0].className).toContain('print:min-h-0');
			expect(sheets[0].querySelectorAll('.print\\:break-before-page')).toHaveLength(0);
		}
	});

	it('표지: 이름·총 경력·경력 기간·연락처 4개·기술 스택이 이력서와 같다', () => {
		const { container } = render(<PortfolioPrintPage />);
		const cover = pageOf(container, 'cover');

		expect(within(cover).getByRole('heading', { level: 1, name: META_AUTHOR_NAME })).toBeInTheDocument();
		expect(cover.textContent).toContain(`총 경력 ${getTotalCareerDuration()}`);
		for (const { organization, period } of getPortfolioExperience()) {
			expect(cover.textContent).toContain(organization);
			expect(cover.textContent).toContain(period);
		}
		for (const { value } of getPrintContacts()) expect(cover.textContent).toContain(value);
		expect(getPrintContacts()).toHaveLength(4);
		for (const skill of getPrintSkills()) expect(cover.textContent).toContain(skill);
		expect(cover.textContent).toContain(`${RESUME.projects.length}개 서비스`);
		expect(cover.textContent).toContain(PRINT_IDENTITY_CLAIM);
		expect(cover.textContent).toMatch(/사례 9개\s*전문/);
		// 출처 안내문과 측정·관측·전언·기재 칩은 없다(출처는 수치 문장 안 괄호로 둔다).
		expect(cover.textContent).not.toMatch(/수치는 측정|측정·관측|관측|전언|기재/);
	});

	it('표지의 숫자 카드는 테두리형 2개이고 값은 사례 결과 문장의 수치와 일치한다', () => {
		const { container } = render(<PortfolioPrintPage />);
		const cover = pageOf(container, 'cover');
		const stats = within(within(cover).getByRole('list', { name: '대표 숫자' })).getAllByRole('listitem');

		expect(stats).toHaveLength(PORTFOLIO_KEY_RESULTS.length);
		for (const [index, result] of PORTFOLIO_KEY_RESULTS.entries()) {
			const entry = getPrintFeatured().find(item => item.slug === result.slug);

			expect(stats[index].textContent).toBe(`${result.value}${result.label}`);
			expect(entry?.item.stages.find(stage => stage.id === 'result')?.text).toContain(result.value);
		}
	});

	it('표지 목차는 대표 사례 5개 + 그 밖의 작업이고, 흐름에 따라 바뀌는 쪽 번호는 싣지 않는다', () => {
		const { container } = render(<PortfolioPrintPage />);
		const toc = Array.from(pageOf(container, 'cover').querySelectorAll<HTMLElement>('[data-toc-item]'));
		const featured = getPrintFeatured();

		expect(toc).toHaveLength(featured.length + 1);
		for (const [index, entry] of featured.entries()) {
			expect(toc[index].textContent).toBe(
				`${index + 1}${entry.item.title}${entry.item.organization} · ${entry.item.period}`,
			);
		}
		expect(toc[featured.length].textContent).toContain(`그 밖의 작업 ${getPrintOthers().length}건`);
		expect(pageOf(container, 'cover').querySelector('[data-toc-page]')).toBeNull();
		expect(pageOf(container, 'cover').textContent).toContain(PRINT_PORTFOLIO_URL);
	});

	describe('사례', () => {
		it('번호·회사·제목·한 줄 요약 → 문제 → 해결 → 구현 포인트 → 결과 순서이고, 판단 표·한계 섹션·출처 칩은 없다', () => {
			const { container } = render(<PortfolioPrintPage />);

			for (const [index, entry] of getPrintFeatured().entries()) {
				const page = pageOf(container, 'case', entry.slug);
				const headings = ['문제', '해결', '구현 포인트', '결과'].map(name =>
					within(page).getByRole('heading', { level: 3, name }),
				);
				const result = headings[3].closest('section') as HTMLElement;
				const resultStage = entry.item.stages.find(stage => stage.id === 'result')!;

				expect(within(page).getByRole('heading', { level: 2, name: entry.item.title })).toBeInTheDocument();
				expect(page.textContent).toContain(String(index + 1).padStart(2, '0'));
				expect(page.textContent).toContain(entry.item.organization);
				expect(page.querySelector('[data-print-oneline]')?.textContent).toBe(entry.oneLine);
				for (let i = 1; i < headings.length; i += 1) {
					expect(
						headings[i - 1].compareDocumentPosition(headings[i]) & Node.DOCUMENT_POSITION_FOLLOWING,
						entry.slug,
					).toBeTruthy();
				}
				expect(result.textContent, entry.slug).toContain(resultStage.text);
				expect(within(page).queryByRole('table'), entry.slug).toBeNull();
				expect(within(page).queryByRole('heading', { name: '어떻게 정했나' }), entry.slug).toBeNull();
				expect(within(page).queryByRole('heading', { name: '확인 범위와 한계' }), entry.slug).toBeNull();
				expect(page.querySelector('[data-print-tag]'), entry.slug).toBeNull();
				expect(page.textContent, entry.slug).not.toMatch(/구현 중 풀었던 문제|[①②③]|\(계속\)/);
				expect(page.querySelectorAll('[data-testid="trouble"]').length, entry.slug).toBeLessThanOrEqual(
					PRINT_MAX_TROUBLES,
				);
				expect(page.querySelectorAll('[data-testid="sequence-diagram"]').length, entry.slug).toBeLessThanOrEqual(1);
				expect(page.querySelectorAll('[data-testid="sequence-step"]').length, entry.slug).toBeLessThanOrEqual(
					PRINT_MAX_DIAGRAM_STEPS,
				);
			}
		});

		it('수치가 있는 사례의 결과는 수치 문장으로 시작하고 출처를 괄호로 단다', () => {
			const { container } = render(<PortfolioPrintPage />);
			const expected: Record<string, string> = {
				'wellomarket-checkout': '오픈 후 1개월 동안 결제 금액 관련 CS 문의와 API 에러 로그는 0건이었습니다.',
				'wello-responsive-search': '데스크톱 평균 참여 시간이 약 20% 증가했습니다(GA4, 개편 전후 2주 단순 비교).',
				'donation-duplicate-guard': '중복 기부 관련 CS 재문의가 약 70% 줄었습니다(CS 담당자 전언).',
				'avatar-studio-performance': 'FCP가 3초 이상에서 400~600ms로 줄었습니다(Lighthouse 측정).',
			};

			for (const [slug, sentence] of Object.entries(expected)) {
				const page = pageOf(container, 'case', slug);
				const result = within(page).getByRole('heading', { level: 3, name: '결과' }).closest('section')!;

				expect(result.querySelector('p')?.textContent?.startsWith(sentence), slug).toBe(true);
			}
		});

		it('도식은 보조기기용 순서 목록을 함께 둔다', () => {
			const { container } = render(<PortfolioPrintPage />);

			for (const diagram of container.querySelectorAll('[data-testid="sequence-diagram"]')) {
				expect(diagram.querySelector('[aria-hidden="true"]')).not.toBeNull();
				expect(diagram.querySelectorAll('ol.sr-only > li').length).toBe(
					diagram.querySelectorAll('[data-testid="sequence-step"]').length,
				);
			}
		});

		it('대표 사례마다 구현 포인트 아래·결과 위에 가상의 예시 화면이 하나 있고, 그 밖의 작업에는 없다', () => {
			const { container } = render(<PortfolioPrintPage />);

			expect(container.querySelectorAll('figure[data-example-screen]')).toHaveLength(getPrintFeatured().length);
			for (const entry of getPrintFeatured()) {
				const page = pageOf(container, 'case', entry.slug);
				const example = getExampleScreen(entry.slug)!;
				const figure = within(page).getByRole('img', { name: example.alt }).closest('figure')!;
				const troubles = within(page).getByRole('heading', { level: 3, name: '구현 포인트' });
				const result = within(page).getByRole('heading', { level: 3, name: '결과' });

				expect(figure.dataset.exampleScreen).toBe(entry.slug);
				expect(figure.className, entry.slug).toContain('break-inside-avoid');
				expect(figure.querySelector('figcaption')?.textContent, entry.slug).toContain(EXAMPLE_NOTICE);
				expect(troubles.compareDocumentPosition(figure) & Node.DOCUMENT_POSITION_FOLLOWING, entry.slug).toBeTruthy();
				expect(figure.compareDocumentPosition(result) & Node.DOCUMENT_POSITION_FOLLOWING, entry.slug).toBeTruthy();
				expect(page.querySelectorAll('figure[data-example-screen]'), entry.slug).toHaveLength(1);
			}
			expect(pageOf(container, 'others').querySelector('figure[data-example-screen]')).toBeNull();
		});

		it('"담당:"·"내가 맡은 것" 문구가 문서 어디에도 없다', () => {
			const { container } = render(<PortfolioPrintPage />);

			expect(container.textContent).not.toMatch(/담당:|내가 맡은 것/);
		});
	});

	describe('그 밖의 작업', () => {
		it('표 대신 사례당 한 줄(제목 · 회사·기간 · 한 줄 설명)로 지정 순서대로 나오고 사례 본문으로는 나오지 않는다', () => {
			const { container } = render(<PortfolioPrintPage />);
			const page = pageOf(container, 'others');
			const rows = Array.from(page.querySelectorAll<HTMLElement>('[data-other-item]'));

			expect(within(page).getByRole('heading', { level: 2, name: '그 밖의 작업' })).toBeInTheDocument();
			expect(within(page).queryByRole('table')).toBeNull();
			expect(rows).toHaveLength(4);
			expect(rows.map(row => row.dataset.otherItem)).toEqual(getPrintOthers().map(entry => entry.item.slug));
			for (const [index, { item, line }] of getPrintOthers().entries()) {
				expect(rows[index].textContent).toBe(`${item.title}${item.organization} · ${item.period}${line}`);
				expect(container.querySelector(`[data-print-case="${item.slug}"]`)).toBeNull();
			}
		});

		it('용어 풀이 블록은 없다', () => {
			const { container } = render(<PortfolioPrintPage />);

			expect(container.textContent).not.toContain('자주 나오는 용어');
			expect(container.querySelector('#print-glossary-title')).toBeNull();
		});

		it('글·오픈소스 링크는 주소 글자 그대로 보이고 한 줄 설명만 붙으며, 연락처 4줄과 웹 포트폴리오 주소가 있다', () => {
			const { container } = render(<PortfolioPrintPage />);
			const page = pageOf(container, 'others');

			expect(within(page).getByRole('heading', { level: 3, name: '글·오픈소스' })).toBeInTheDocument();
			expect(page.textContent).not.toMatch(/더 확인할 수 있는 기술 자료|이 글에서 확인할 판단|기여 내용/);
			for (const ref of getPrintReferences()) {
				expect(within(page).getByRole('link', { name: ref.url })).toHaveAttribute('href', ref.url);
				expect(page.textContent).toContain(`${ref.label}${ref.point}`);
			}
			for (const contact of getPrintContacts())
				expect(within(page).getByRole('link', { name: contact.value })).toHaveAttribute('href', contact.href);
			expect(within(page).getByRole('link', { name: PRINT_PORTFOLIO_URL })).toBeInTheDocument();
		});
	});

	it('제목 순서: h1 은 표지에 하나, 사례는 h2 다', () => {
		const { container } = render(<PortfolioPrintPage />);

		expect(container.querySelectorAll('h1')).toHaveLength(1);
		for (const article of container.querySelectorAll('[data-print-case]'))
			expect(article.querySelectorAll('h2')).toHaveLength(1);
	});

	it('인쇄에 불필요한 내비게이션·표지 띠는 사례 안에 없다', () => {
		const { container } = render(<PortfolioPrintPage />);

		expect(screen.queryByText('다른 프로젝트')).toBeNull();
		expect(container.querySelector('[data-testid="case-cover"]')).toBeNull();
		expect(screen.getAllByRole('link', { name: '← 포트폴리오로' })).toHaveLength(1);
	});
});

describe('PrintButton', () => {
	it('누르면 window.print 를 부른다', () => {
		const print = vi.spyOn(window, 'print').mockImplementation(() => {});

		render(<PrintButton />);
		fireEvent.click(screen.getByRole('button', { name: 'PDF로 저장' }));

		expect(print).toHaveBeenCalledTimes(1);
		print.mockRestore();
	});
});

describe('PortfolioTopBar PDF 링크', () => {
	it('/portfolio/print 를 가리킨다', () => {
		render(<PortfolioTopBar />);

		expect(screen.getByRole('link', { name: 'PDF' })).toHaveAttribute('href', '/portfolio/print');
	});
});

describe('색인 제외', () => {
	it('사이트맵에 /portfolio/print 가 없다', async () => {
		expect((await sitemap()).some(entry => entry.url.includes('/portfolio/print'))).toBe(false);
	});

	it('robots 가 내놓는 규칙 어디에도 print 경로를 허용으로 싣지 않는다', () => {
		expect(JSON.stringify(robots())).not.toContain('/portfolio/print');
	});
});

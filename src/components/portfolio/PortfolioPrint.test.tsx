// @vitest-environment jsdom

import { fireEvent, render, screen, within } from '@testing-library/react';

import PortfolioPrintPage, { metadata } from '@/app/portfolio/print/page';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import { META_AUTHOR_NAME } from '@/constant';
import RESUME from '@/constant/resume';
import { getPortfolioExperience, PORTFOLIO_KEY_RESULTS } from '@/portfolio/overview';
import {
	EVIDENCE_TAGS,
	getPrintContacts,
	getPrintFeatured,
	getPrintOthers,
	getPrintPages,
	getPrintReferences,
	getPrintSkills,
	getTotalCareerDuration,
	PRINT_FEATURED_SLUGS,
	PRINT_FOOTER_LABEL,
	PRINT_IDENTITY_CLAIM,
	PRINT_MAX_DECISIONS,
	PRINT_MAX_DIAGRAM_STEPS,
	PRINT_MAX_TROUBLES,
	PRINT_PAGES_PER_CASE,
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

	it('꼬리말 문구는 상수에서 만든 @page 규칙으로 들어간다', () => {
		const { container } = render(<PortfolioPrintPage />);
		const style = container.querySelector('style') as HTMLStyleElement;

		expect(style.textContent).toContain(JSON.stringify(PRINT_FOOTER_LABEL));
	});

	it('쪽 마커가 표지 1 + 사례 5x2 + 그 밖의 작업 1 = 12개이고 순서가 맞다', () => {
		const { container } = render(<PortfolioPrintPage />);
		const pages = Array.from(container.querySelectorAll<HTMLElement>('[data-print-page]')).map(
			el => el.dataset.printPage,
		);

		expect(pages).toHaveLength(getPrintPages().total);
		expect(pages).toEqual(['cover', ...PRINT_FEATURED_SLUGS.flatMap(() => ['case-a', 'case-b']), 'others']);
		expect(PRINT_PAGES_PER_CASE).toBe(2);
		expect(
			Array.from(container.querySelectorAll<HTMLElement>('[data-print-case]')).map(el => el.dataset.printCase),
		).toEqual([...PRINT_FEATURED_SLUGS]);
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
	});

	it('표지의 숫자 카드는 테두리형 2개이고 값은 사례의 출처 있는 수치와 일치한다', () => {
		const { container } = render(<PortfolioPrintPage />);
		const cover = pageOf(container, 'cover');
		const stats = within(within(cover).getByRole('list', { name: '대표 숫자' })).getAllByRole('listitem');

		expect(stats).toHaveLength(PORTFOLIO_KEY_RESULTS.length);
		for (const [index, result] of PORTFOLIO_KEY_RESULTS.entries()) {
			const entry = getPrintFeatured().find(item => item.slug === result.slug);

			expect(stats[index].textContent).toContain(result.value);
			expect(stats[index].textContent).toContain(result.label);
			expect(entry?.evidence?.text).toContain(result.value);
		}
	});

	it('표지 목차는 대표 사례 5개 + 그 밖의 작업이고 쪽 번호가 실제 쪽과 맞다', () => {
		const { container } = render(<PortfolioPrintPage />);
		const toc = Array.from(pageOf(container, 'cover').querySelectorAll<HTMLElement>('[data-toc-item]'));
		const featured = getPrintFeatured();

		expect(toc).toHaveLength(featured.length + 1);
		for (const [index, entry] of featured.entries()) {
			expect(toc[index].textContent).toContain(entry.item.title);
			expect(toc[index].textContent).toContain(entry.tocPhrase);
			expect(toc[index].querySelector('[data-toc-page]')?.textContent).toBe(String([2, 4, 6, 8, 10][index]));
		}
		expect(toc[featured.length].textContent).toContain(`그 밖의 작업 ${getPrintOthers().length}건`);
		expect(toc[featured.length].querySelector('[data-toc-page]')?.textContent).toBe('12');
		expect(pageOf(container, 'cover').textContent).toContain(PRINT_PORTFOLIO_URL);
	});

	describe('사례', () => {
		it('A쪽: 번호·회사·제목·한 줄 성과와 문제·해결·선택 이유 표가 있고 판단 카드는 없다', () => {
			const { container } = render(<PortfolioPrintPage />);

			for (const [index, entry] of getPrintFeatured().entries()) {
				const page = pageOf(container, 'case-a', entry.slug);

				expect(within(page).getByRole('heading', { level: 2, name: entry.item.title })).toBeInTheDocument();
				expect(page.textContent).toContain(String(index + 1).padStart(2, '0'));
				expect(page.textContent).toContain(entry.item.organization);
				expect(page.querySelector('[data-print-oneline]')?.textContent).toContain(entry.oneLine);
				expect(within(page).getByRole('heading', { level: 3, name: '문제' })).toBeInTheDocument();
				expect(within(page).getByRole('heading', { level: 3, name: '해결' })).toBeInTheDocument();
				const table = within(page).getByRole('table');

				expect(
					within(table)
						.getAllByRole('columnheader')
						.map(el => el.textContent),
				).toEqual(['질문', '선택']);
				expect(within(table).getAllByRole('rowheader').length).toBeLessThanOrEqual(PRINT_MAX_DECISIONS);
				expect(page.querySelector('[data-testid="decision-chosen"]')).toBeNull();
				expect(page.querySelector('#decisions')).toBeNull();
			}
		});

		it('숫자 출처 태그는 수치가 있는 사례의 한 줄 성과 박스에 한 번만 나온다', () => {
			const { container } = render(<PortfolioPrintPage />);

			for (const entry of getPrintFeatured()) {
				const tags = container
					.querySelector(`[data-print-case="${entry.slug}"]`)
					?.querySelectorAll('[data-print-tag]') as NodeListOf<HTMLElement>;

				if (!entry.evidence) {
					expect(tags, entry.slug).toHaveLength(0);
					continue;
				}
				expect(tags, entry.slug).toHaveLength(1);
				expect(EVIDENCE_TAGS).toContain(tags[0].textContent);
				expect(tags[0].closest('[data-print-evidence]')?.textContent).toContain(entry.evidence.text);
			}
		});

		it('B쪽: 풀었던 문제 2개 이하, 도식은 5단계 이하로 1개 이하, 결과에는 수치·해명 문장이 없고 한계가 있다', () => {
			const { container } = render(<PortfolioPrintPage />);

			for (const entry of getPrintFeatured()) {
				const page = pageOf(container, 'case-b', entry.slug);
				const diagrams = page.querySelectorAll('[data-testid="sequence-diagram"]');
				const result = within(page).getByRole('heading', { level: 3, name: '결과' }).closest('section') as HTMLElement;

				expect(page.querySelectorAll('[data-testid="trouble"]').length, entry.slug).toBeLessThanOrEqual(
					PRINT_MAX_TROUBLES,
				);
				expect(diagrams.length, entry.slug).toBeLessThanOrEqual(1);
				expect(page.querySelectorAll('[data-testid="sequence-step"]').length, entry.slug).toBeLessThanOrEqual(
					PRINT_MAX_DIAGRAM_STEPS,
				);
				for (const figure of entry.evidence?.text.match(/\d[\d.,~]*\s?(?:건|%|ms|초)/g) ?? [])
					expect(result.textContent, entry.slug).not.toContain(figure);
				expect(result.textContent, entry.slug).not.toMatch(/없습니다|아닙니다|않았습니다/);
				expect(within(page).getByRole('heading', { level: 3, name: '한계' }).parentElement?.textContent).toContain(
					entry.limit,
				);
				expect(page.textContent).toContain(`${entry.item.title} (계속)`);
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

		it('"담당:"·"내가 맡은 것" 문구가 문서 어디에도 없다', () => {
			const { container } = render(<PortfolioPrintPage />);

			expect(container.textContent).not.toMatch(/담당:|내가 맡은 것/);
		});
	});

	describe('그 밖의 작업', () => {
		it('표에 회사·기간·작업·핵심이 지정 순서로 나오고 사례 본문으로는 나오지 않는다', () => {
			const { container } = render(<PortfolioPrintPage />);
			const page = pageOf(container, 'others');
			const rows = Array.from(page.querySelectorAll<HTMLElement>('[data-other-item]'));

			expect(within(page).getByRole('heading', { level: 2, name: '그 밖의 작업' })).toBeInTheDocument();
			expect(
				within(page)
					.getAllByRole('columnheader')
					.map(el => el.textContent),
			).toEqual(['회사', '기간', '작업', '핵심']);
			expect(rows.map(row => row.dataset.otherItem)).toEqual(getPrintOthers().map(entry => entry.item.slug));
			for (const [index, { item, line }] of getPrintOthers().entries()) {
				expect(rows[index].textContent).toContain(item.organization);
				expect(rows[index].textContent).toContain(item.title);
				expect(rows[index].textContent).toContain(line);
				expect(container.querySelector(`[data-print-case="${item.slug}"]`)).toBeNull();
			}
		});

		it('기술 자료 링크는 주소 글자 그대로 보이고, 연락처 4줄과 웹 포트폴리오 주소가 있다', () => {
			const { container } = render(<PortfolioPrintPage />);
			const page = pageOf(container, 'others');

			for (const ref of getPrintReferences()) {
				expect(within(page).getByRole('link', { name: ref.url })).toHaveAttribute('href', ref.url);
				expect(page.textContent).toContain(`이 글에서 확인할 판단: ${ref.point}`);
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

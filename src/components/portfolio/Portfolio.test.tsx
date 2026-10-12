// @vitest-environment jsdom

import { render, screen, within } from '@testing-library/react';

import { GITHUB_URL, LINKEDIN_URL } from '@/constant';
import RESUME from '@/constant/resume';
import { buildCasePath, PORTFOLIO_CASES } from '@/portfolio/cases';
import { getExhibit } from '@/portfolio/exhibits';

import CaseStudy from './CaseStudy';
import PortfolioOverview from './PortfolioOverview';

const exitReasons = RESUME.careers.flatMap(career => (career.exitReason ? [career.exitReason] : []));

const expectCompactNavLinks = (nav: HTMLElement) => {
	expect(within(nav).getByRole('link', { name: '이력서' })).toHaveAttribute('href', '/resume');
	expect(within(nav).getByRole('link', { name: '블로그' })).toHaveAttribute('href', '/blog/posts');
	expect(within(nav).getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', GITHUB_URL);
	expect(within(nav).getByRole('link', { name: /LinkedIn/ })).toHaveAttribute('href', LINKEDIN_URL);
};

const expectNonShrinkingNav = (nav: HTMLElement) => {
	const lists = nav.querySelectorAll('ul');
	expect(lists.length).toBeGreaterThan(0);
	for (const list of lists) {
		expect(list).toHaveClass('shrink-0');
		for (const item of list.querySelectorAll(':scope > li')) {
			expect(item).toHaveClass('shrink-0');
		}
	}
	for (const link of nav.querySelectorAll('a')) {
		expect(link).toHaveClass('shrink-0');
	}
	for (const link of nav.querySelectorAll('a:not([target="_blank"])')) {
		expect(link).toHaveClass('whitespace-nowrap');
	}
	// 가로 스크롤 컨테이너는 키보드 포커스 링과 마지막 링크를 잘라낸다. 줄바꿈으로 전부 보이게 한다.
	expect(nav.querySelector('.overflow-x-auto, .overflow-auto, .overflow-hidden')).toBeNull();
	expect(nav.querySelector('.flex-wrap')).not.toBeNull();
};

beforeEach(() => {
	vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null as never);
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('PortfolioOverview', () => {
	it('내비가 각 섹션 앵커와 이력서·블로그·GitHub·LinkedIn 링크를 가진다', () => {
		render(<PortfolioOverview />);

		const nav = screen.getByRole('navigation', { name: '포트폴리오 내비게이션' });

		for (const [label, id] of [
			['전시', 'exhibit'],
			['사례', 'cases'],
			['경력', 'experience'],
		]) {
			expect(within(nav).getByRole('link', { name: label })).toHaveAttribute('href', `#${id}`);
			expect(document.getElementById(id)).not.toBeNull();
		}
		expectCompactNavLinks(nav);
		expectNonShrinkingNav(nav);
	});

	it('외부 링크는 새 탭으로 열리고 rel 이 안전하다', () => {
		render(<PortfolioOverview />);

		const nav = screen.getByRole('navigation', { name: '포트폴리오 내비게이션' });

		for (const link of [
			within(nav).getByRole('link', { name: /GitHub/ }),
			within(nav).getByRole('link', { name: /LinkedIn/ }),
		]) {
			expect(link).toHaveAttribute('target', '_blank');
			expect(link.getAttribute('rel')).toContain('noopener');
		}
	});

	it('모든 사례 카드가 사례 페이지로 연결되고 서비스 이미지나 구조 도식을 먼저 보여 준다', () => {
		render(<PortfolioOverview />);

		const cases = document.getElementById('cases')!;

		for (const item of PORTFOLIO_CASES) {
			const exhibit = getExhibit(item.slug)!;
			const link = within(cases).getByRole('link', { name: exhibit.headline });

			expect(link).toHaveAttribute('href', buildCasePath(item.slug));

			const card = link.closest('li')!;

			expect(card.querySelector('img, svg')).not.toBeNull();
		}
	});

	it('대표 전시는 서버 렌더만으로 평면 도식과 전·후·단계 컨트롤을 가진다', () => {
		render(<PortfolioOverview />);

		const exhibit = screen.getByTestId('service-exhibit');

		expect(within(exhibit).getByRole('img', { name: /시스템 구조 도식/ })).toBeInTheDocument();
		expect(within(exhibit).getByRole('radio', { name: /위험 시나리오/ })).toBeInTheDocument();
		// 계층 분해는 3D 를 켠 뒤에만 쓴다.
		expect(within(exhibit).queryByRole('switch')).toBeNull();
		expect(screen.queryByTestId('service-canvas')).not.toBeInTheDocument();
	});

	it('퇴사 사유와 광고 슬롯, 이메일을 렌더하지 않는다', () => {
		const { container } = render(<PortfolioOverview />);

		for (const reason of exitReasons) expect(container.textContent).not.toContain(reason);
		expect(container.textContent).not.toContain('권고사직');
		expect(container.querySelector('ins.adsbygoogle')).toBeNull();
		expect(container.querySelector('a[href^="mailto:"]')).toBeNull();
	});
});

describe('CaseStudy', () => {
	const item = PORTFOLIO_CASES[1];

	it('전시와 이력서 기록 섹션, 그리고 이를 가리키는 내비 앵커를 렌더한다', () => {
		const { container } = render(<CaseStudy item={item} />);

		const nav = screen.getByRole('navigation', { name: '포트폴리오 내비게이션' });

		const exhibit = getExhibit(item.slug)!;

		expect(screen.getByRole('heading', { level: 2, name: exhibit.headline })).toBeInTheDocument();
		expect(screen.getByText(item.title)).toBeInTheDocument();
		for (const [label, id] of [
			['구조', 'exhibit'],
			['이력서 원문', 'record'],
		]) {
			expect(within(nav).getByRole('link', { name: label })).toHaveAttribute('href', `#${id}`);
			expect(document.getElementById(id)).not.toBeNull();
		}
		// 이전에 공개했던 단계 앵커(#problem 등)도 유지한다.
		for (const stage of item.stages) expect(container.querySelector(`section#${stage.id}`)).not.toBeNull();
		expect(within(nav).getByRole('link', { name: /포트폴리오/ })).toHaveAttribute('href', '/portfolio');
		expectCompactNavLinks(nav);
		expectNonShrinkingNav(nav);
	});

	it('이웃 사례로 이동하는 링크를 준다', () => {
		render(<CaseStudy item={item} />);

		const other = screen.getByRole('navigation', { name: '다른 사례' });

		expect(within(other).getByRole('link', { name: new RegExp(PORTFOLIO_CASES[0].title) })).toHaveAttribute(
			'href',
			buildCasePath(PORTFOLIO_CASES[0].slug),
		);
		expect(within(other).getByRole('link', { name: new RegExp(PORTFOLIO_CASES[2].title) })).toHaveAttribute(
			'href',
			buildCasePath(PORTFOLIO_CASES[2].slug),
		);
	});

	it('퇴사 사유와 광고 슬롯을 렌더하지 않는다', () => {
		for (const each of PORTFOLIO_CASES) {
			const { container, unmount } = render(<CaseStudy item={each} />);

			expect(container.textContent).not.toContain('권고사직');
			expect(container.querySelector('ins.adsbygoogle')).toBeNull();
			unmount();
		}
	});
});

// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';

import HideOnPortfolio from './HideOnPortfolio';

const pathname = vi.hoisted(() => ({ current: '/' }));

vi.mock('next/navigation', () => ({ usePathname: () => pathname.current }));

describe('HideOnPortfolio', () => {
	it('일반 페이지에서는 공통 헤더·푸터를 그린다', () => {
		pathname.current = '/blog/posts';
		render(<HideOnPortfolio>공통 영역</HideOnPortfolio>);

		expect(screen.getByText('공통 영역')).toBeInTheDocument();
	});

	it('포트폴리오 목록과 사례 상세에서는 그리지 않는다', () => {
		for (const path of ['/portfolio', '/portfolio/wellomarket-checkout']) {
			pathname.current = path;
			const { container, unmount } = render(<HideOnPortfolio>공통 영역</HideOnPortfolio>);

			expect(container.textContent, path).toBe('');
			unmount();
		}
	});

	it('이름이 비슷한 다른 경로는 숨기지 않는다', () => {
		pathname.current = '/portfolio-notes';
		render(<HideOnPortfolio>공통 영역</HideOnPortfolio>);

		expect(screen.getByText('공통 영역')).toBeInTheDocument();
	});
});

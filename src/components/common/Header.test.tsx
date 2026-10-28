// @vitest-environment jsdom

import { render, screen, within } from '@testing-library/react';

import { WEB_PATH } from '@/constant';

import Header from './Header';

const pathname = vi.hoisted(() => ({ current: '/' }));

vi.mock('next/navigation', () => ({ usePathname: () => pathname.current }));
vi.mock('@/hooks/useScrollDirection', () => ({ default: () => true }));
vi.mock('./ModeToggle', () => ({ ModeToggle: () => null }));

describe('Header', () => {
	it('블로그·포트폴리오·이력서 메뉴를 각자의 경로로 연결한다', () => {
		pathname.current = '/blog/posts';
		render(<Header />);

		for (const item of Object.values(WEB_PATH)) {
			expect(screen.getByRole('link', { name: item.label })).toHaveAttribute('href', item.path());
		}
		expect(Object.values(WEB_PATH).map(item => item.label)).toEqual(['Posts', '포트폴리오', '이력서']);
	});

	it('현재 경로의 메뉴만 현재 페이지로 표시한다', () => {
		pathname.current = '/resume';
		render(<Header />);

		const nav = screen.getAllByRole('navigation')[0];

		expect(within(nav).getByRole('link', { name: '이력서' })).toHaveAttribute('aria-current', 'page');
		expect(within(nav).getByRole('link', { name: 'Posts' })).not.toHaveAttribute('aria-current');
		expect(within(nav).getByRole('link', { name: '포트폴리오' })).not.toHaveAttribute('aria-current');
	});
});

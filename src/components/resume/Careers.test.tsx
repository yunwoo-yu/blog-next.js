// @vitest-environment jsdom

import { render, screen, within } from '@testing-library/react';

import RESUME from '@/constant/resume';

import Careers from './Careers';

const getArticle = (organization: string) =>
	screen.getByRole('heading', { level: 4, name: organization }).closest('article')!;

describe('경력', () => {
	it('회사·직무·기간·소개·기술 스택을 보여 준다', () => {
		render(<Careers />);

		for (const career of RESUME.careers) {
			const article = getArticle(career.organization);

			expect(within(article).getByText(career.position)).toBeInTheDocument();
			expect(within(article).getByText(career.description)).toBeInTheDocument();
			for (const tech of career.techStack) {
				expect(within(article).getAllByText(tech).length, `${career.organization} ${tech}`).toBeGreaterThan(0);
			}
		}
	});

	it('경력은 최신 회사부터 나온다', () => {
		render(<Careers />);

		const organizations = screen.getAllByRole('heading', { level: 4 }).map(heading => heading.textContent);

		expect(organizations).toEqual(RESUME.careers.map(career => career.organization));
		expect(RESUME.careers.map(career => career.startDate)).toEqual(
			[...RESUME.careers.map(career => career.startDate)].sort().reverse(),
		);
	});

	it('프로젝트 상세는 경력에 싣지 않는다', () => {
		render(<Careers />);

		expect(screen.queryAllByRole('heading', { level: 5 })).toHaveLength(0);
	});
});

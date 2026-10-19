// @vitest-environment jsdom

import { render, screen, within } from '@testing-library/react';

import RESUME, { getOrganizationSummary } from '@/constant/resume';

import Careers from './Careers';

const getArticle = (organization: string) =>
	screen.getByRole('heading', { level: 4, name: organization }).closest('article')!;

describe('경력', () => {
	it('회사·직무·기간·소개를 보여 주고 기술 스택은 따로 모은 섹션에서만 보여 준다', () => {
		render(<Careers />);

		for (const career of RESUME.careers) {
			const article = getArticle(career.organization);

			expect(within(article).getByText(career.position)).toBeInTheDocument();
			expect(within(article).getByText(career.description)).toBeInTheDocument();
			expect(article.textContent).not.toContain(career.techStack.join(', '));
		}
	});

	it('경력 곳수·합산 기간 같은 요약 줄은 싣지 않는다', () => {
		render(<Careers />);

		expect(document.body.textContent).not.toMatch(/경력 \d+곳|총 \d+년/);
	});

	it('각 회사에 프로젝트가 몇 개이고 어떤 프로젝트인지 이름으로 보여 준다', () => {
		render(<Careers />);

		for (const career of RESUME.careers) {
			const { projects, services } = getOrganizationSummary(RESUME.projects, career.organization);
			const line = within(getArticle(career.organization)).getByTestId('project-summary');

			expect(line.textContent).toContain(`프로젝트 ${projects}개`);
			expect(line.textContent).not.toMatch(/업무 \d+건|\(\d+\)/);
			expect(line.textContent).toContain(services.map(({ service }) => service).join(' / '));
		}
	});

	it('경력은 최신 회사부터 나온다', () => {
		render(<Careers />);

		expect(screen.getAllByRole('heading', { level: 4 }).map(heading => heading.textContent)).toEqual(
			RESUME.careers.map(career => career.organization),
		);
		expect(RESUME.careers.map(career => career.startDate)).toEqual(
			[...RESUME.careers.map(career => career.startDate)].sort().reverse(),
		);
	});

	it('한 일(프로젝트 불릿)은 경력에 싣지 않는다', () => {
		render(<Careers />);

		expect(screen.queryAllByTestId('work-item')).toHaveLength(0);
		expect(screen.queryAllByRole('listitem')).toHaveLength(0);
	});

	it('회사 소개는 서비스와 담당 업무를 한 문단으로 짧게 보여 준다', () => {
		for (const career of RESUME.careers)
			expect(career.description.length, career.organization).toBeLessThanOrEqual(110);
	});
});

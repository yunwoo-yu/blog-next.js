// @vitest-environment jsdom

import { render, screen, within } from '@testing-library/react';

import RESUME, { getOrganizationSummary } from '@/constant/resume';

import Projects from './Projects';

type Project = (typeof RESUME.projects)[number];

const getSection = (project: Project) =>
	screen
		.getAllByRole('heading', { level: 5 })
		.find(
			heading =>
				heading.textContent === project.service &&
				heading.closest('div[data-org]')?.getAttribute('data-org') === project.organization,
		)!
		.closest('section')!;

describe('프로젝트', () => {
	it('회사별로 묶고 회사 제목에 프로젝트 개수를 보여 준다', () => {
		render(<Projects />);

		const companies = screen.getAllByRole('heading', { level: 4 }).map(heading => heading.textContent);

		expect(companies).toEqual(
			RESUME.careers.map(career => {
				const { projects } = getOrganizationSummary(RESUME.projects, career.organization);

				return `${career.organization} 프로젝트 ${projects}개`;
			}),
		);
	});

	it('서비스 이름을 제목으로 그 회사 안에서 최신 서비스부터 나열한다', () => {
		render(<Projects />);

		for (const career of RESUME.careers) {
			const group = document.querySelector(`div[data-org="${career.organization}"]`) as HTMLElement;
			const titles = within(group)
				.getAllByRole('heading', { level: 5 })
				.map(heading => heading.textContent);

			expect(titles).toEqual(
				RESUME.projects.filter(project => project.organization === career.organization).map(project => project.service),
			);
		}
	});

	it('각 서비스 제목 아래에 그 서비스에서 한 일을 따로 모은다', () => {
		render(<Projects />);

		for (const project of RESUME.projects) {
			const rows = within(getSection(project)).getAllByTestId('work-item');

			expect(rows, project.service).toHaveLength(project.items.length);
			project.items.forEach((item, index) => {
				expect(rows[index].textContent).toContain(item.summary);
				expect(rows[index].textContent).not.toContain(item.date);
			});
		}
	});

	it('서비스 설명을 보여 주고 기술 키워드는 경력에서만 보여 준다', () => {
		render(<Projects />);

		for (const project of RESUME.projects) {
			const section = getSection(project);

			if (project.serviceDescription) expect(section.textContent).toContain(project.serviceDescription);
			expect(section.textContent).not.toContain(project.techStack.join(', '));
		}
	});

	it('항목에 포트폴리오 상세 링크와 화살표를 달지 않는다', () => {
		render(<Projects />);

		expect(screen.queryAllByRole('link', { name: /포트폴리오 상세/ })).toHaveLength(0);
		expect(document.body.textContent).not.toMatch(/상세 →|→/);
	});

	it('항목의 외부 링크를 함께 보여 준다', () => {
		render(<Projects />);

		const links = RESUME.projects.flatMap(project => project.items.flatMap(item => item.links ?? []));

		expect(links.length).toBeGreaterThan(0);
		for (const link of links) {
			expect(screen.getByRole('link', { name: link.title })).toHaveAttribute('href', link.url);
		}
		expect(document.body.textContent).not.toMatch(/\[[^\]]+\]/);
	});
});

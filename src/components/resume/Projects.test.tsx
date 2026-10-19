// @vitest-environment jsdom

import { render, screen, within } from '@testing-library/react';

import RESUME, { getServicePeriod } from '@/constant/resume';

import Projects, { ProjectBlock } from './Projects';

describe('프로젝트 블록', () => {
	it('서비스 이름·소속 회사·기간을 왼쪽 레일에 보여 준다', () => {
		for (const project of RESUME.projects) {
			const { container, unmount } = render(<ProjectBlock project={project} />);

			expect(screen.getByRole('heading', { level: 5, name: project.service })).toBeInTheDocument();
			expect(container.textContent).toContain(project.organization);
			expect(container.textContent).toContain(getServicePeriod(project));
			unmount();
		}
	});

	it('설명·역할·업무·사용 기술을 구분해 보여 준다', () => {
		for (const project of RESUME.projects) {
			const { container, unmount } = render(<ProjectBlock project={project} />);

			for (const label of ['설명', '역할', '업무', '사용 기술']) {
				expect(screen.getByText(label, { selector: 'h6, h6 *' }), `${project.service} ${label}`).toBeInTheDocument();
			}
			for (const role of project.role) expect(container.textContent).toContain(role);
			for (const tech of project.techStack) expect(container.textContent).toContain(tech);
			unmount();
		}
	});

	it('업무 항목을 최신순으로 제목·기간·요약과 함께 보여 준다', () => {
		for (const project of RESUME.projects) {
			const { unmount } = render(<ProjectBlock project={project} />);

			const works = screen.getByRole('list', { name: `${project.service} 업무` });
			const rows = within(works).getAllByRole('listitem');

			expect(rows).toHaveLength(project.items.length);
			project.items.forEach((item, index) => {
				expect(rows[index].textContent).toContain(item.title);
				expect(rows[index].textContent).toContain(item.date);
				expect(rows[index].textContent).toContain(item.summary);
			});
			unmount();
		}
	});

	it('성과가 있는 항목은 성과를 따로 보여 준다', () => {
		for (const project of RESUME.projects) {
			const { unmount } = render(<ProjectBlock project={project} />);
			const works = screen.getByRole('list', { name: `${project.service} 업무` });
			const rows = within(works).getAllByRole('listitem');

			project.items.forEach((item, index) => {
				const row = rows[index];

				if (item.outcome) {
					const outcome = row.querySelector('[data-field="outcome"]')!;

					expect(outcome.textContent).toContain(item.outcome.value);
					if (item.outcome.note) expect(outcome.textContent).toContain(item.outcome.note);
				} else {
					expect(row.querySelector('[data-field="outcome"]')).toBeNull();
				}
			});
			unmount();
		}
	});

	it('업무마다 포트폴리오 상세로 가는 링크를 주고 인쇄에서는 숨긴다', () => {
		for (const project of RESUME.projects) {
			const { unmount } = render(<ProjectBlock project={project} />);

			for (const item of project.items) {
				const link = screen.getByRole('link', {
					name: name => name.includes(item.title) && name.includes('포트폴리오'),
				});

				expect(link).toHaveAttribute('href', `/portfolio/${item.caseSlug}`);
				expect(link).toHaveClass('print:hidden');
			}
			unmount();
		}
	});

	it('항목의 외부 링크를 함께 보여 준다', () => {
		const withLinks = RESUME.projects.filter(project => project.items.some(item => item.links?.length));

		expect(withLinks.length).toBeGreaterThan(0);
		for (const project of withLinks) {
			const { unmount } = render(<ProjectBlock project={project} />);

			for (const link of project.items.flatMap(item => item.links ?? [])) {
				expect(screen.getByRole('link', { name: new RegExp(link.title) })).toHaveAttribute('href', link.url);
			}
			unmount();
		}
	});
});

describe('프로젝트 섹션', () => {
	it('경력과 별도 섹션으로 모든 서비스를 최신순으로 보여 준다', () => {
		render(<Projects />);

		expect(screen.getByRole('heading', { level: 3, name: '프로젝트' })).toBeInTheDocument();
		expect(screen.getAllByRole('heading', { level: 5 }).map(heading => heading.textContent)).toEqual(
			RESUME.projects.map(project => project.service),
		);
	});
});

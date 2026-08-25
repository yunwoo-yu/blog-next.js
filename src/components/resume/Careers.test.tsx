// @vitest-environment jsdom

import { render, screen, within } from '@testing-library/react';

import RESUME from '@/constant/resume';

import Careers from './Careers';

const projects = RESUME.careers.flatMap(career => career.serviceGroups.flatMap(group => group.projects));

describe('경력 프로젝트 콘텐츠', () => {
	it('모든 프로젝트는 문제·기여·결과 세 문단으로 구성된다', () => {
		for (const project of projects) {
			expect(project.details, project.title).toHaveLength(3);
		}
	});

	it('각 문단은 본문에 포함된 핵심 문구를 1~2개만 강조한다', () => {
		for (const project of projects) {
			for (const detail of project.details) {
				expect(detail.highlights.length, project.title).toBeGreaterThanOrEqual(1);
				expect(detail.highlights.length, project.title).toBeLessThanOrEqual(2);

				for (const highlight of detail.highlights) {
					expect(detail.title.includes(highlight), `[${project.title}] 본문에 없는 강조 문구: ${highlight}`).toBe(true);
				}
			}
		}
	});
});

describe('경력 서비스 구분', () => {
	it('각 프로젝트를 소속 서비스 섹션 안에 렌더링한다', () => {
		render(<Careers />);

		for (const career of RESUME.careers) {
			for (const group of career.serviceGroups) {
				const serviceHeading = screen.getByRole('heading', {
					level: 5,
					name: group.service,
				});
				const serviceSection = serviceHeading.closest('section');

				expect(serviceSection).not.toBeNull();

				for (const project of group.projects) {
					expect(
						within(serviceSection!).getByRole('heading', {
							level: 6,
							name: project.title,
						}),
					).toBeInTheDocument();
				}
			}
		}
	});
});

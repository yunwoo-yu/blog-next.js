// @vitest-environment jsdom

import { render, screen, within } from '@testing-library/react';

import RESUME from '@/constant/resume';

import KeyOutcomes, { getKeyOutcomes } from './KeyOutcomes';

describe('핵심 성과', () => {
	it('프로젝트 항목의 outcome 을 순서대로, 문구 변경 없이 모은다', () => {
		const expected = RESUME.projects.flatMap(project =>
			project.items.flatMap(item => (item.outcome ? [[item.title, item.outcome.value]] : [])),
		);

		expect(getKeyOutcomes().map(({ title, value }) => [title, value])).toEqual(expected);
		expect(expected.length).toBeGreaterThan(0);
	});

	it('성과 값과 해당 프로젝트 제목을 함께 보여 준다', () => {
		render(<KeyOutcomes />);

		expect(screen.getByRole('heading', { level: 3, name: '핵심 성과' })).toBeInTheDocument();
		const rows = within(screen.getByRole('list')).getAllByRole('listitem');

		getKeyOutcomes().forEach(({ title, value }, index) => {
			expect(rows[index].textContent).toContain(value);
			expect(rows[index].textContent).toContain(title);
		});
	});
});

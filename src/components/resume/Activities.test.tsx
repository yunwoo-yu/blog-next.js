// @vitest-environment jsdom

import { render, screen, within } from '@testing-library/react';

import RESUME from '@/constant/resume';

import Activities from './Activities';

describe('대외활동', () => {
	it('활동명과 기간을 보여 준다', () => {
		render(<Activities />);

		for (const activity of RESUME.activities) {
			const article = screen.getByRole('heading', { level: 4, name: activity.title }).closest('article')!;

			expect(article.textContent).toContain(activity.period);
		}
	});

	it('수상·선정과 오픈소스 기여만 불릿으로 적고 활동 내용 서술은 싣지 않는다', () => {
		render(<Activities />);

		expect(screen.queryAllByRole('listitem').map(item => item.textContent)).toEqual([
			'최종 주차 성능 최적화 과제 BP(Best Practice) 선정',
			'과학기술정보통신부 장관상 대상 수상',
			'Argo Workflows UI 기여 PR 3건 머지(1건 공동 작성)',
		]);
	});

	it('오픈소스 기여는 내 기여 PR 필터 링크 하나로 걸고 PDF에서도 링크로 보인다', () => {
		render(<Activities />);

		const link = screen.getByRole('link', { name: 'Argo Workflows UI 기여 PR 3건 머지' });

		expect(link).toHaveAttribute('href', expect.stringContaining('is%3Amerged+involves%3Ayunwoo-yu'));
		expect(link.className).toContain('underline');
		expect(link.className).toContain('print:!underline');
		expect(screen.getAllByRole('link')).toHaveLength(1);
	});

	it('수상이 없는 활동은 불릿 없이 활동명과 기간만 보여 준다', () => {
		render(<Activities />);

		const article = screen
			.getByRole('heading', { level: 4, name: /멋쟁이사자처럼 프론트엔드 스쿨/ })
			.closest('article')!;

		expect(within(article).queryAllByRole('listitem')).toHaveLength(0);
	});
});

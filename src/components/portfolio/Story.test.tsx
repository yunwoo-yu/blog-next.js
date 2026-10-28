// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';

import type { CaseStory as CaseStoryData, SequenceDiagram as DiagramData } from '@/portfolio/stories';

import CaseStory from './CaseStory';
import Paragraphs from './Paragraphs';
import SequenceDiagram from './SequenceDiagram';

const diagram: DiagramData = {
	actors: ['앱', '서버', '결제사'],
	caption: '이중 요청이 들어오는 순서',
	steps: [
		{ from: 0, to: 1, label: '결제 요청' },
		{ from: 1, to: 2, label: '승인 요청', tone: 'problem' },
		{ from: 2, to: 1, label: '승인 완료' },
		{ from: 1, to: 1, label: '이미 처리된 주문인지 확인', tone: 'fix' },
	],
};

describe('SequenceDiagram', () => {
	it('보이는 단계 수와 sr-only 순서 목록이 steps 와 같다', () => {
		const { container } = render(<SequenceDiagram diagram={diagram} />);
		const visible = container.querySelectorAll('[data-testid="sequence-step"]');
		const readable = container.querySelectorAll('ol.sr-only > li');

		expect(visible).toHaveLength(diagram.steps.length);
		expect(readable).toHaveLength(diagram.steps.length);
		diagram.steps.forEach((step, index) => {
			expect(readable[index].textContent).toContain(step.label);
			expect(visible[index].textContent).toContain(step.label);
		});
		expect(readable[1].textContent).toContain('문제');
		expect(readable[3].textContent).toContain('해결');
		expect(container.querySelector('[data-testid="sequence-diagram"]')).toHaveAttribute('aria-hidden', 'true');
		expect(screen.getByText('이중 요청이 들어오는 순서')).toBeInTheDocument();
	});
});

describe('Paragraphs', () => {
	it('빈 줄로 나눈 본문을 문단 여러 개로, 없으면 하나로 그린다', () => {
		const { container, rerender } = render(<Paragraphs text={'하나\n\n둘\n\n\n셋'} />);

		expect(container.querySelectorAll('p')).toHaveLength(3);
		rerender(<Paragraphs text={'한 문단\n줄바꿈만'} />);
		expect(container.querySelectorAll('p')).toHaveLength(1);
	});
});

describe('CaseStory 문제 섹션', () => {
	it('선택 여부와 별개로 각 옵션의 실제 라벨을 카드에 보여 준다', () => {
		const options: CaseStoryData['decisions'][number]['options'] = [
			{ label: '지금 접근', name: '현재', verdict: 'chosen', reason: '현재 이유', basis: 'code' },
			{ label: '처음 접근', name: '이전', verdict: 'rejected', reason: '이전 이유', basis: 'resume' },
		];
		const { container } = render(
			<CaseStory
				story={{ slug: 'labels', checks: [], troubles: [], decisions: [{ question: '처리 방식', options }] }}
			/>,
		);

		for (const option of options) {
			const card = container.querySelector(`[data-testid="decision-${option.verdict}"]`)!;

			expect(card.textContent).toContain(option.label);
			expect(card.textContent).toContain(option.name);
			expect(card.textContent).toContain(option.reason);
		}
		expect(container.querySelector('.sm\\:grid-cols-2')).not.toBeNull();
		expect(container.textContent).not.toMatch(/선택한 방법|검토했지만 고르지 않은 방법/);
	});

	const story: CaseStoryData = {
		slug: 's',
		decisions: [],
		checks: [],
		troubles: [
			{ problem: '첫 문제', fix: '해결 하나\n\n해결 둘', basis: 'resume', diagram },
			{ problem: '둘째 문제', fix: '해결만', basis: 'resume' },
		],
	};

	it('제목 → 도식 → 해결 순서로, 트러블마다 구분해 보여 준다', () => {
		const { container } = render(<CaseStory story={story} />);
		const items = container.querySelectorAll('[data-testid="trouble"]');
		const first = items[0];
		const order = ['h4', '[data-testid="sequence-diagram"]', '[data-testid="trouble-fix"]'].map(
			selector => first.querySelector(selector)!,
		);

		expect(items).toHaveLength(2);
		for (let i = 1; i < order.length; i += 1) {
			expect(order[i - 1].compareDocumentPosition(order[i]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
		}
		expect(first.querySelectorAll('[data-testid="trouble-fix"] p')).toHaveLength(2);
		expect(items[1].querySelector('[data-testid="sequence-diagram"]')).toBeNull();
		expect(container.querySelector('pre')).toBeNull();
		expect(container.querySelector('ol')!.className).toContain('divide-y');
	});

	it('초안 배지는 draft 일 때만 보인다', () => {
		const draft: CaseStoryData = {
			...story,
			troubles: [{ problem: '초안 문제', fix: 'x', basis: 'draft' }],
		};

		render(<CaseStory story={draft} />);
		expect(screen.getByText(/초안 · 개발 모드에서만 보임/)).toBeInTheDocument();
	});

	it('고르지 않은 방법이 없으면 선택한 방법 한 장만 그린다', () => {
		const only: CaseStoryData = {
			...story,
			troubles: [],
			decisions: [
				{
					question: '무엇을 고르나',
					options: [{ label: '준비한 방식', name: 'A', verdict: 'chosen', reason: '이유', basis: 'resume' }],
				},
			],
		};
		const { container } = render(<CaseStory story={only} />);

		expect(screen.getByText('준비한 방식')).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: '어떻게 정했나' })).toBeInTheDocument();
		expect(container.querySelectorAll('[data-testid="decision-chosen"]')).toHaveLength(1);
		expect(container.querySelector('[data-testid="decision-rejected"]')).toBeNull();
		expect(container.querySelector('.sm\\:grid-cols-2')).toBeNull();
	});
});

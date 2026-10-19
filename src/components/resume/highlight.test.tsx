// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';

import { renderRichText } from './highlight';

describe('renderRichText', () => {
	it('강조 문구를 굵게 보여 준다', () => {
		const { container } = render(<p>{renderRichText('결과 70% 감소 확인', ['70% 감소'])}</p>);

		expect(container.querySelector('strong')?.textContent).toBe('70% 감소');
	});

	it('문장 안에 링크 제목이 있으면 그 문구에 링크를 건다', () => {
		const { container } = render(
			<p>
				{renderRichText(
					'읽던 위치 유지(역방향 무한스크롤) 구현',
					[],
					[{ title: '역방향 무한스크롤', url: 'https://example.test/post' }],
				)}
			</p>,
		);

		expect(screen.getByRole('link', { name: '역방향 무한스크롤' })).toHaveAttribute(
			'href',
			'https://example.test/post',
		);
		expect(container.textContent).toBe('읽던 위치 유지(역방향 무한스크롤) 구현');
	});

	it('문장에 링크 제목이 없으면 끝에 (제목) 꼴로 붙이고 대괄호를 쓰지 않는다', () => {
		const { container } = render(
			<p>
				{renderRichText(
					'PR 3개를 머지했습니다.',
					[],
					[
						{ title: '#1', url: 'https://example.test/1' },
						{ title: '#2', url: 'https://example.test/2' },
					],
				)}
			</p>,
		);

		expect(container.textContent).toBe('PR 3개를 머지했습니다. (#1, #2)');
		expect(screen.getAllByRole('link')).toHaveLength(2);
		expect(container.textContent).not.toMatch(/[[\]]/);
	});

	it('강조와 링크를 함께 쓸 수 있다', () => {
		const { container } = render(
			<p>
				{renderRichText(
					'A 구축, 효과 20% 증가(자세히)',
					['20% 증가'],
					[{ title: '자세히', url: 'https://example.test' }],
				)}
			</p>,
		);

		expect(container.querySelector('strong')?.textContent).toBe('20% 증가');
		expect(screen.getByRole('link', { name: '자세히' })).toBeInTheDocument();
	});
});

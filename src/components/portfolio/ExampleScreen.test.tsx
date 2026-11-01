// @vitest-environment jsdom

import { render, screen, within } from '@testing-library/react';

import { EXAMPLE_FORBIDDEN_TERMS, EXAMPLE_NOTICE, EXAMPLE_SCREENS } from '@/portfolio/examples';

import ExampleScreen from './ExampleScreen';

const VARIANTS = ['web', 'print'] as const;

describe('ExampleScreen', () => {
	for (const variant of VARIANTS) {
		it(`${variant}: 모든 예시가 figure 안의 role="img"(이름=alt)와 읽히는 표기·caption 으로 그려진다`, () => {
			for (const example of EXAMPLE_SCREENS) {
				const { container, unmount } = render(<ExampleScreen example={example} variant={variant} />);
				const figure = container.querySelector('figure') as HTMLElement;
				const picture = within(figure).getByRole('img', { name: example.alt });
				const caption = figure.querySelector('figcaption') as HTMLElement;

				expect(figure.dataset.exampleScreen).toBe(example.slug);
				expect(picture.firstElementChild?.getAttribute('aria-hidden'), example.slug).toBe('true');
				// 표기·caption 은 role="img" 밖의 figcaption 에 있어 보조기기도 읽는다.
				expect(picture.contains(caption)).toBe(false);
				expect(caption.textContent, example.slug).toContain(EXAMPLE_NOTICE);
				expect(caption.textContent, example.slug).toContain(example.caption);
				// 가짜 주소와 화면 이름이 그림 안에 보인다.
				expect(picture.textContent, example.slug).toContain(example.data.address);
				expect(picture.textContent, example.slug).toContain(example.title);
				unmount();
			}
		});
	}

	it('외부 이미지·제목·누를 수 있는 요소·애니메이션이 없다', () => {
		for (const example of EXAMPLE_SCREENS) {
			const { container, unmount } = render(<ExampleScreen example={example} />);

			expect(container.querySelector('img, picture, iframe, video'), example.slug).toBeNull();
			expect(container.querySelector('h1, h2, h3, h4, h5, h6'), example.slug).toBeNull();
			expect(container.querySelector('a, button, input, select, textarea, [tabindex]'), example.slug).toBeNull();
			expect(container.innerHTML, example.slug).not.toMatch(/animate-|transition|hover:/);
			unmount();
		}
	});

	it('렌더 결과(컴포넌트가 붙이는 라벨 포함)에도 실제 서비스·회사 이름이 없다', () => {
		for (const example of EXAMPLE_SCREENS) {
			const { container, unmount } = render(<ExampleScreen example={example} variant="print" />);
			const text = container.textContent ?? '';
			const label = container.querySelector('[role="img"]')?.getAttribute('aria-label') ?? '';

			for (const term of EXAMPLE_FORBIDDEN_TERMS) {
				const pattern = new RegExp(term, /[A-Za-z]/.test(term) ? 'i' : '');

				expect(text, `${example.slug}: ${term}`).not.toMatch(pattern);
				expect(label, `${example.slug}: ${term}`).not.toMatch(pattern);
			}
			unmount();
		}
	});

	it('오류·실패는 색 말고도 점선 테두리와 "오류"·"실패" 글자로 구분한다', () => {
		const withErrors = EXAMPLE_SCREENS.filter(example =>
			['form-errors', 'attachment-form', 'stepper-results'].includes(example.kind),
		);

		expect(withErrors).toHaveLength(3);
		for (const example of withErrors) {
			const { container, unmount } = render(<ExampleScreen example={example} />);

			expect(container.querySelector('.border-dashed'), example.slug).not.toBeNull();
			expect(screen.getAllByText('오류').length, example.slug).toBeGreaterThan(0);
			unmount();
		}
	});
});

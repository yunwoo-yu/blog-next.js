// @vitest-environment jsdom

import { render, screen, within } from '@testing-library/react';

import {
	EXAMPLE_FORBIDDEN_TERMS,
	EXAMPLE_LABEL,
	EXAMPLE_NOTICE,
	EXAMPLE_SCREENS,
	type ExampleScreen as ExampleScreenData,
} from '@/portfolio/examples';

import ExampleScreen from './ExampleScreen';

const VARIANTS = ['web', 'print'] as const;

/** 예시 데이터에서 화면에 오류 문구로 나가야 하는 값들. */
const errorMessagesOf = (example: ExampleScreenData): string[] => {
	switch (example.kind) {
		case 'form-errors':
			return [...example.data.fields, ...example.data.group.items].flatMap(field => field.error ?? []);
		case 'attachment-form':
			return example.data.field.error ? [example.data.field.error] : [];
		case 'stepper-results':
			return [example.data.failNotice];
		default:
			return [];
	}
};

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
				// 설명줄은 표기 한 줄 + caption 한 줄이다.
				expect(caption.firstElementChild?.textContent, example.slug).toBe(EXAMPLE_NOTICE);
				expect(caption.textContent, example.slug).toBe(`${EXAMPLE_NOTICE}${example.caption}`);
				// "예시" 배지는 브라우저 틀 윗줄 끝에 있고 설명줄에 되풀이하지 않는다.
				expect(picture.firstElementChild?.firstElementChild?.lastElementChild?.textContent, example.slug).toBe(
					EXAMPLE_LABEL,
				);
				expect(caption.textContent, example.slug).not.toContain(EXAMPLE_LABEL);
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

	it('렌더 결과(글자·aria-label·data-* 를 포함한 모든 속성값)에 실제 서비스·회사 이름이 없다', () => {
		for (const variant of VARIANTS) {
			for (const example of EXAMPLE_SCREENS) {
				const { container, unmount } = render(<ExampleScreen example={example} variant={variant} />);
				// data-example-screen 의 slug 는 주소(URL)와 같은 공개 식별자라 그 속성값 하나만 비우고 검사한다.
				const slugAttribute = `data-example-screen="${example.slug}"`;
				const html = container.innerHTML;

				expect(html.split(slugAttribute).length - 1, example.slug).toBe(1);

				const checked = html.replace(slugAttribute, 'data-example-screen=""');

				for (const term of EXAMPLE_FORBIDDEN_TERMS) {
					const pattern = new RegExp(term, /[A-Za-z]/.test(term) ? 'i' : '');

					expect(checked, `${variant} ${example.slug}: ${term}`).not.toMatch(pattern);
				}
				unmount();
			}
		}
	});

	it('금지어 검사는 slug 속성 밖의 속성값에 든 이름을 잡는다(빈 검사로 통과하지 않게)', () => {
		const example = EXAMPLE_SCREENS.find(item => item.slug.includes('wello'))!;
		const { container, unmount } = render(<ExampleScreen example={example} className="wello-test" />);
		const checked = container.innerHTML.replace(`data-example-screen="${example.slug}"`, 'data-example-screen=""');

		expect(checked).toMatch(/wello/i);
		unmount();
	});

	it('오류·실패는 색 말고도 아이콘과 "오류"·"실패" 글자 라벨로 구분한다', () => {
		for (const variant of VARIANTS) {
			const withErrors = EXAMPLE_SCREENS.filter(example =>
				['form-errors', 'attachment-form', 'stepper-results'].includes(example.kind),
			);

			expect(withErrors).toHaveLength(3);
			for (const example of withErrors) {
				const messages = errorMessagesOf(example);
				const { unmount } = render(<ExampleScreen example={example} variant={variant} />);

				expect(messages.length, example.slug).toBeGreaterThan(0);
				for (const message of messages) {
					const element = screen.getByText(message);

					// 문구 바로 앞에 "오류" 라벨이 붙고, 같은 줄에 아이콘이 있다.
					expect(element.textContent, `${variant} ${example.slug}`).toBe(`오류${message}`);
					expect(element.closest('p')?.querySelector('svg'), `${variant} ${example.slug}`).not.toBeNull();
				}
				if (example.kind === 'stepper-results') {
					for (const result of example.data.results) {
						const row = screen.getByText(result.label).closest('li') as HTMLElement;
						const label = result.ok ? '성공' : '실패';

						expect(row.textContent, `${variant} ${result.label}`).toBe(`${result.label}${label}`);
						expect(row.querySelector('svg'), `${variant} ${result.label}`).not.toBeNull();
					}
				}
				unmount();
			}
		}
	});
});

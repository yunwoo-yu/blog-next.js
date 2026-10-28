// @vitest-environment jsdom

import { act, render, screen } from '@testing-library/react';

import CountUp, { scaleNumbers } from './CountUp';
import Reveal from './Reveal';

type Callback = (entries: { isIntersecting: boolean }[]) => void;

let callbacks: Callback[] = [];

const stubObserver = () => {
	callbacks = [];
	vi.stubGlobal(
		'IntersectionObserver',
		class {
			constructor(cb: Callback) {
				callbacks.push(cb);
			}
			observe() {}
			disconnect() {}
		},
	);
};

const stubMotion = (reduce: boolean) =>
	vi.stubGlobal('matchMedia', (query: string) => ({ matches: reduce && query.includes('reduce'), media: query }));

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('scaleNumbers', () => {
	it('문자열 안의 모든 정수를 비율로 줄인다', () => {
		expect(scaleNumbers('400~600ms', 0.5)).toBe('200~300ms');
		expect(scaleNumbers('400~600ms', -0.01)).toBe('0~0ms');
		expect(scaleNumbers('70%', 0)).toBe('0%');
		expect(scaleNumbers('0건', 0.3)).toBe('0건');
	});
});

describe('CountUp', () => {
	it('모션을 줄이면 처음부터 최종값이고 시작하지 않는다', () => {
		stubObserver();
		stubMotion(true);
		render(<CountUp value="70%" />);

		expect(screen.getByTestId('count-up').textContent).toBe('70%');
		expect(callbacks).toHaveLength(0);
	});

	it('관찰 API 가 없으면 최종값이다', () => {
		render(<CountUp value="400~600ms" />);

		expect(screen.getByTestId('count-up').textContent).toBe('400~600ms');
	});

	it('모션을 허용하면 0에서 시작해 보이는 순간 최종값까지 올라간다', () => {
		stubObserver();
		stubMotion(false);
		let now = 0;
		const frames: FrameRequestCallback[] = [];

		vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => frames.push(cb));
		vi.spyOn(performance, 'now').mockImplementation(() => now);
		render(<CountUp value="70%" />);

		expect(screen.getByTestId('count-up').textContent).toBe('0%');
		act(() => callbacks[0]([{ isIntersecting: true }]));
		now = 5000;
		act(() => frames.shift()!(now));
		expect(screen.getByTestId('count-up').textContent).toBe('70%');
	});

	it('보조기기용 최종값을 따로 둔다', () => {
		stubObserver();
		stubMotion(false);
		const { container } = render(<CountUp value="70%" />);

		expect(container.querySelector('.sr-only')!.textContent).toBe('70%');
		expect(screen.getByTestId('count-up')).toHaveAttribute('aria-hidden', 'true');
	});
});

describe('Reveal', () => {
	it('모션을 줄이면 숨기지 않는다', () => {
		stubObserver();
		stubMotion(true);
		const { container } = render(<Reveal>내용</Reveal>);

		expect(container.firstElementChild).toHaveAttribute('data-revealed', 'true');
		expect(callbacks).toHaveLength(0);
	});

	it('화면 아래 요소는 숨겼다가 보이면 나타난다', () => {
		stubObserver();
		stubMotion(false);
		vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ top: 5000 } as DOMRect);
		const { container } = render(<Reveal>내용</Reveal>);

		expect(container.firstElementChild).toHaveAttribute('data-revealed', 'false');
		act(() => callbacks[0]([{ isIntersecting: true }]));
		expect(container.firstElementChild).toHaveAttribute('data-revealed', 'true');
		vi.restoreAllMocks();
	});
});

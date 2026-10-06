// @vitest-environment jsdom

import { detectWebGL } from './webgl-support';

const stubContexts = (contexts: Record<string, unknown>) =>
	vi
		.spyOn(HTMLCanvasElement.prototype, 'getContext')
		.mockImplementation(((type: string) => contexts[type] ?? null) as never);

describe('detectWebGL', () => {
	afterEach(() => vi.restoreAllMocks());

	it('webgl2 컨텍스트가 있으면 true', () => {
		const spy = stubContexts({ webgl2: { getExtension: () => null } });

		expect(detectWebGL()).toBe(true);
		expect(spy).toHaveBeenCalledWith('webgl2');
	});

	it('webgl1 만 있으면 false (three 는 webgl2 가 필요하다)', () => {
		const spy = stubContexts({ webgl: { getExtension: () => null } });

		expect(detectWebGL()).toBe(false);
		expect(spy).not.toHaveBeenCalledWith('webgl');
	});

	it('컨텍스트가 없으면 false', () => {
		stubContexts({});
		expect(detectWebGL()).toBe(false);
	});

	it('getContext 가 던져도 false', () => {
		vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => {
			throw new Error('blocked');
		});
		expect(detectWebGL()).toBe(false);
	});

	it('확인용 컨텍스트를 loseContext 로 반납하고 캔버스 크기를 비운다', () => {
		const loseContext = vi.fn();
		let probe: HTMLCanvasElement | undefined;
		vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function (this: HTMLCanvasElement) {
			probe = this;
			return { getExtension: (name: string) => (name === 'WEBGL_lose_context' ? { loseContext } : null) } as never;
		} as never);

		expect(detectWebGL()).toBe(true);
		expect(loseContext).toHaveBeenCalledTimes(1);
		expect(probe?.width).toBe(0);
		expect(probe?.height).toBe(0);
	});

	it('lose_context 확장이 없어도 true 를 돌려주고 던지지 않는다', () => {
		stubContexts({ webgl2: { getExtension: () => null } });
		expect(() => detectWebGL()).not.toThrow();
	});
});

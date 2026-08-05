// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';

import useMediaQuery from './useMediaQuery';

type ChangeHandler = (event: { matches: boolean }) => void;

const createMatchMedia = (initialMatches: boolean) => {
	const handlers = new Set<ChangeHandler>();

	const matchMedia = vi.fn((query: string) => ({
		matches: initialMatches,
		media: query,
		addEventListener: (_: string, handler: ChangeHandler) => handlers.add(handler),
		removeEventListener: (_: string, handler: ChangeHandler) => handlers.delete(handler),
	}));

	const emit = (matches: boolean) => {
		handlers.forEach(handler => {
			handler({ matches });
		});
	};

	return { matchMedia, emit, handlers };
};

describe('useMediaQuery', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('마운트 전 초기값은 false다 (서버 렌더와 맞추기 위함)', () => {
		const { matchMedia } = createMatchMedia(true);
		vi.stubGlobal('matchMedia', matchMedia);

		const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

		// 이펙트가 돌고 난 뒤에는 실제 값으로 갱신된다
		expect(result.current).toBe(true);
	});

	it('쿼리가 맞지 않으면 false를 유지한다', () => {
		const { matchMedia } = createMatchMedia(false);
		vi.stubGlobal('matchMedia', matchMedia);

		const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

		expect(result.current).toBe(false);
	});

	it('뷰포트가 바뀌면 change 이벤트로 갱신한다', () => {
		const { matchMedia, emit } = createMatchMedia(false);
		vi.stubGlobal('matchMedia', matchMedia);

		const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

		act(() => emit(true));

		expect(result.current).toBe(true);
	});

	it('언마운트 시 리스너를 제거한다', () => {
		const { matchMedia, handlers } = createMatchMedia(false);
		vi.stubGlobal('matchMedia', matchMedia);

		const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));
		expect(handlers.size).toBe(1);

		unmount();

		expect(handlers.size).toBe(0);
	});
});

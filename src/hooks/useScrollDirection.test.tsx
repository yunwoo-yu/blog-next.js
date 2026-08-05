// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';

import useScrollDirection from './useScrollDirection';

const fireScroll = (scrollY: number) => {
	Object.defineProperty(window, 'scrollY', { value: scrollY, writable: true });
	window.dispatchEvent(new Event('scroll'));
};

describe('useScrollDirection', () => {
	beforeEach(() => {
		Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
	});

	it('초기 상태는 true(헤더 표시)이다', () => {
		const { result } = renderHook(() => useScrollDirection());

		expect(result.current).toBe(true);
	});

	it('상단에서 충분히 벗어난 뒤 아래로 스크롤하면 헤더를 숨긴다', () => {
		const { result } = renderHook(() => useScrollDirection());

		act(() => fireScroll(100));
		act(() => fireScroll(200));

		expect(result.current).toBe(false);
	});

	it('위로 스크롤하면 헤더를 다시 표시한다', () => {
		const { result } = renderHook(() => useScrollDirection());

		act(() => fireScroll(300));
		act(() => fireScroll(400));
		act(() => fireScroll(350));

		expect(result.current).toBe(true);
	});

	it('페이지 최상단 부근에서는 아래로 스크롤해도 헤더를 유지한다', () => {
		const { result } = renderHook(() => useScrollDirection());

		act(() => fireScroll(10));
		act(() => fireScroll(70));

		expect(result.current).toBe(true);
	});

	it('숨겨진 상태에서 최상단으로 돌아오면 다시 표시한다', () => {
		const { result } = renderHook(() => useScrollDirection());

		act(() => fireScroll(200));
		act(() => fireScroll(400));
		expect(result.current).toBe(false);

		act(() => fireScroll(0));

		expect(result.current).toBe(true);
	});

	it('5px 미만의 스크롤은 무시한다', () => {
		const { result } = renderHook(() => useScrollDirection());

		act(() => fireScroll(200));
		act(() => fireScroll(400));
		act(() => fireScroll(403));

		expect(result.current).toBe(false);
	});

	it('언마운트 시 scroll 이벤트 리스너를 제거한다', () => {
		const removeSpy = vi.spyOn(window, 'removeEventListener');

		const { unmount } = renderHook(() => useScrollDirection());
		unmount();

		expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
		removeSpy.mockRestore();
	});
});

// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';

import useObserverToc from './useObserverToc';

let observerCallback: (entries: Partial<IntersectionObserverEntry>[]) => void;
const observeMock = vi.fn();
const disconnectMock = vi.fn();

beforeEach(() => {
	observeMock.mockClear();
	disconnectMock.mockClear();

	const MockIntersectionObserver = class {
		constructor(callback: (entries: Partial<IntersectionObserverEntry>[]) => void) {
			observerCallback = callback;
		}
		observe = observeMock;
		disconnect = disconnectMock;
		unobserve = vi.fn();
	};

	vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
});

afterEach(() => {
	vi.unstubAllGlobals();
	document.body.innerHTML = '';
});

describe('useObserverToc', () => {
	it('초기 activeIds는 빈 배열이다', () => {
		const { result } = renderHook(() => useObserverToc());

		expect(result.current.activeIds).toEqual([]);
	});

	it('h2와 h3 요소를 observe한다', () => {
		document.body.innerHTML = '<h2 id="a">A</h2><h3 id="b">B</h3>';

		renderHook(() => useObserverToc());

		expect(observeMock).toHaveBeenCalledTimes(2);
	});

	it('가시 영역에 진입한 heading의 id를 activeIds로 설정한다', () => {
		document.body.innerHTML = '<h2 id="section-1">Section 1</h2>';

		const { result } = renderHook(() => useObserverToc());

		act(() => {
			observerCallback([
				{ isIntersecting: true, intersectionRatio: 0.9, target: document.getElementById('section-1')! },
			]);
		});

		expect(result.current.activeIds).toEqual(['#section-1']);
	});

	it('여러 heading이 보일 때 intersectionRatio가 가장 높은 것을 선택한다', () => {
		document.body.innerHTML = '<h2 id="a">A</h2><h2 id="b">B</h2>';

		const { result } = renderHook(() => useObserverToc());

		act(() => {
			observerCallback([
				{ isIntersecting: true, intersectionRatio: 0.3, target: document.getElementById('a')! },
				{ isIntersecting: true, intersectionRatio: 0.8, target: document.getElementById('b')! },
			]);
		});

		expect(result.current.activeIds).toEqual(['#b']);
	});

	it('언마운트 시 observer를 disconnect한다', () => {
		const { unmount } = renderHook(() => useObserverToc());

		unmount();

		expect(disconnectMock).toHaveBeenCalled();
	});
});

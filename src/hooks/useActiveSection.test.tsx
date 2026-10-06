// @vitest-environment jsdom

import { act, renderHook } from '@testing-library/react';

import useActiveSection from './useActiveSection';

type ObserverCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

let callback: ObserverCallback;
const disconnect = vi.fn();

beforeEach(() => {
	document.body.innerHTML = '<section id="a"></section><section id="b"></section>';
	disconnect.mockClear();
	vi.stubGlobal(
		'IntersectionObserver',
		class {
			constructor(cb: ObserverCallback) {
				callback = cb;
			}
			observe = vi.fn();
			disconnect = disconnect;
		},
	);
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('useActiveSection', () => {
	it('처음에는 현재 섹션이 없다', () => {
		const { result } = renderHook(() => useActiveSection(['a', 'b']));

		expect(result.current).toBeNull();
	});

	it('화면에 걸친 섹션을 현재 섹션으로 돌려준다', () => {
		const { result } = renderHook(() => useActiveSection(['a', 'b']));

		act(() => callback([{ target: document.getElementById('b')!, isIntersecting: true }]));

		expect(result.current).toBe('b');
	});

	it('여러 섹션이 걸치면 문서 순서상 앞선 섹션을 고른다', () => {
		const { result } = renderHook(() => useActiveSection(['a', 'b']));

		act(() =>
			callback([
				{ target: document.getElementById('b')!, isIntersecting: true },
				{ target: document.getElementById('a')!, isIntersecting: true },
			]),
		);

		expect(result.current).toBe('a');
	});

	it('걸친 섹션이 모두 사라지면 마지막 값을 유지한다', () => {
		const { result } = renderHook(() => useActiveSection(['a', 'b']));

		act(() => callback([{ target: document.getElementById('a')!, isIntersecting: true }]));
		act(() => callback([{ target: document.getElementById('a')!, isIntersecting: false }]));

		expect(result.current).toBe('a');
	});

	it('IntersectionObserver 가 없으면 아무것도 하지 않는다', () => {
		vi.stubGlobal('IntersectionObserver', undefined);

		const { result } = renderHook(() => useActiveSection(['a']));

		expect(result.current).toBeNull();
	});

	it('언마운트하면 관찰을 끝낸다', () => {
		const { unmount } = renderHook(() => useActiveSection(['a']));

		unmount();

		expect(disconnect).toHaveBeenCalled();
	});
});

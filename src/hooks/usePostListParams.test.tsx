// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';

import usePostListParams, { parseParams, serializeParams } from './usePostListParams';

const setUrl = (search: string) => {
	window.history.replaceState(null, '', `/blog/posts${search}`);
};

describe('parseParams', () => {
	it('비어 있으면 기본값을 돌려준다', () => {
		expect(parseParams('')).toEqual({ query: '', page: 1 });
	});

	it('q와 page를 읽는다', () => {
		expect(parseParams('?q=sort&page=3')).toEqual({ query: 'sort', page: 3 });
	});

	it('URL 인코딩된 한글 검색어를 디코딩한다', () => {
		expect(parseParams('?q=%ED%9A%8C%EA%B3%A0').query).toBe('회고');
	});

	it('숫자가 아닌 page는 1로 본다', () => {
		expect(parseParams('?page=abc').page).toBe(1);
	});

	it('0이나 음수 page는 1로 본다', () => {
		expect(parseParams('?page=0').page).toBe(1);
		expect(parseParams('?page=-2').page).toBe(1);
	});

	it('소수 page는 내림한다', () => {
		expect(parseParams('?page=2.9').page).toBe(2);
	});
});

describe('serializeParams', () => {
	it('기본값이면 빈 문자열이다', () => {
		expect(serializeParams({ query: '', page: 1 })).toBe('');
	});

	it('1페이지는 URL에 남기지 않는다', () => {
		expect(serializeParams({ query: 'sort', page: 1 })).toBe('?q=sort');
	});

	it('2페이지부터 page를 넣는다', () => {
		expect(serializeParams({ query: '', page: 2 })).toBe('?page=2');
	});

	it('검색어와 페이지를 함께 넣는다', () => {
		expect(serializeParams({ query: 'sort', page: 3 })).toBe('?q=sort&page=3');
	});

	it('기존 쿼리스트링의 다른 파라미터는 보존한다', () => {
		expect(serializeParams({ query: '', page: 1 }, '?utm_source=x')).toBe('?utm_source=x');
	});
});

describe('usePostListParams', () => {
	beforeEach(() => {
		setUrl('');
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('서버가 넘긴 초기값으로 시작한다', () => {
		const { result } = renderHook(() => usePostListParams({ query: 'sort', page: 2 }));

		expect(result.current.query).toBe('sort');
		expect(result.current.page).toBe(2);
	});

	it('초기값을 안 주면 빈 상태로 시작한다', () => {
		const { result } = renderHook(() => usePostListParams());

		expect(result.current.query).toBe('');
		expect(result.current.page).toBe(1);
	});

	it('서버가 새 초기값을 내려주면 따라간다', () => {
		const { result, rerender } = renderHook(props => usePostListParams(props), {
			initialProps: { query: '', page: 1 },
		});

		rerender({ query: 'react', page: 3 });

		expect(result.current.query).toBe('react');
		expect(result.current.page).toBe(3);
	});

	it('검색어를 바꾸면 URL에 반영한다', () => {
		const { result } = renderHook(() => usePostListParams());

		act(() => result.current.setQuery('회고'));
		act(() => vi.runAllTimers());

		expect(parseParams(window.location.search).query).toBe('회고');
	});

	it('검색어가 바뀌면 1페이지로 되돌린다', () => {
		const { result } = renderHook(() => usePostListParams({ query: '', page: 3 }));

		act(() => result.current.setQuery('sort'));

		expect(result.current.page).toBe(1);
	});

	it('페이지를 바꿔도 검색어는 유지한다', () => {
		setUrl('?q=sort');

		const { result } = renderHook(() => usePostListParams({ query: 'sort', page: 1 }));

		act(() => result.current.setPage(2));
		act(() => vi.runAllTimers());

		expect(result.current.query).toBe('sort');
		expect(window.location.search).toBe('?q=sort&page=2');
	});

	it('URL 쓰기를 지연시켜 타이핑마다 기록하지 않는다', () => {
		const { result } = renderHook(() => usePostListParams());

		act(() => result.current.setQuery('s'));
		act(() => result.current.setQuery('so'));
		act(() => result.current.setQuery('sort'));

		expect(window.location.search).toBe('');

		act(() => vi.runAllTimers());

		expect(window.location.search).toBe('?q=sort');
	});

	it('뒤로가기(popstate)로 URL이 바뀌면 상태를 따라간다', () => {
		const { result } = renderHook(() => usePostListParams());

		act(() => {
			setUrl('?q=react&page=2');
			window.dispatchEvent(new PopStateEvent('popstate'));
		});

		expect(result.current.query).toBe('react');
		expect(result.current.page).toBe(2);
	});

	it('히스토리에 항목을 쌓지 않는다 (replaceState만 사용)', () => {
		const pushSpy = vi.spyOn(window.history, 'pushState');

		const { result } = renderHook(() => usePostListParams());

		act(() => result.current.setQuery('sort'));
		act(() => vi.runAllTimers());

		expect(pushSpy).not.toHaveBeenCalled();
		pushSpy.mockRestore();
	});
});

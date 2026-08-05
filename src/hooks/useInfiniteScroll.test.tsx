// @vitest-environment jsdom
import { act, render, renderHook, screen } from '@testing-library/react';

import { POSTS_PER_PAGE } from '@/utils/pagination';

import useInfiniteScroll from './useInfiniteScroll';

type ObserverCallback = (entries: { isIntersecting: boolean }[]) => void;

const observerInstances: { callback: ObserverCallback; disconnect: ReturnType<typeof vi.fn> }[] = [];

class MockIntersectionObserver {
	observe = vi.fn();
	disconnect = vi.fn();
	unobserve = vi.fn();

	constructor(callback: ObserverCallback) {
		observerInstances.push({ callback, disconnect: this.disconnect });
	}
}

const triggerIntersection = () => {
	const latest = observerInstances.at(-1);

	act(() => latest?.callback([{ isIntersecting: true }]));
};

const Harness = ({ totalCount }: { totalCount: number }) => {
	const { visibleCount, hasMore, sentinelRef } = useInfiniteScroll({ totalCount, pageSize: 8 });

	return (
		<>
			<span data-testid="count">{visibleCount}</span>
			{hasMore ? <div data-testid="sentinel" ref={sentinelRef} /> : null}
		</>
	);
};

describe('useInfiniteScroll', () => {
	beforeEach(() => {
		observerInstances.length = 0;
		vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('처음에는 pageSize만큼만 보여준다', () => {
		const { result } = renderHook(() => useInfiniteScroll({ totalCount: 30, pageSize: 8 }));

		expect(result.current.visibleCount).toBe(8);
		expect(result.current.hasMore).toBe(true);
	});

	it('총 개수가 pageSize보다 적으면 전부 보여주고 hasMore는 false다', () => {
		const { result } = renderHook(() => useInfiniteScroll({ totalCount: 3, pageSize: 8 }));

		expect(result.current.visibleCount).toBe(3);
		expect(result.current.hasMore).toBe(false);
	});

	it('loadMore를 호출하면 pageSize만큼 늘어난다', () => {
		const { result } = renderHook(() => useInfiniteScroll({ totalCount: 30, pageSize: 8 }));

		act(() => result.current.loadMore());

		expect(result.current.visibleCount).toBe(16);
	});

	it('총 개수를 넘어서 늘어나지 않는다', () => {
		const { result } = renderHook(() => useInfiniteScroll({ totalCount: 10, pageSize: 8 }));

		act(() => result.current.loadMore());
		act(() => result.current.loadMore());

		expect(result.current.visibleCount).toBe(10);
		expect(result.current.hasMore).toBe(false);
	});

	it('센티넬이 교차하면 다음 페이지를 이어붙인다', () => {
		render(<Harness totalCount={30} />);

		expect(screen.getByTestId('count')).toHaveTextContent('8');

		triggerIntersection();

		expect(screen.getByTestId('count')).toHaveTextContent('16');
	});

	it('마지막 페이지까지 오면 센티넬을 더 이상 관찰하지 않는다', () => {
		render(<Harness totalCount={10} />);

		triggerIntersection();

		expect(screen.getByTestId('count')).toHaveTextContent('10');
		expect(screen.queryByTestId('sentinel')).toBeNull();
	});

	it('목록 개수가 바뀌면 첫 페이지로 되돌린다', () => {
		const { result, rerender } = renderHook(props => useInfiniteScroll(props), {
			initialProps: { totalCount: 30, pageSize: 8 },
		});

		act(() => result.current.loadMore());
		expect(result.current.visibleCount).toBe(16);

		rerender({ totalCount: 12, pageSize: 8 });

		expect(result.current.visibleCount).toBe(8);
	});

	it('언마운트하면 observer를 해제한다', () => {
		const { unmount } = renderHook(() => useInfiniteScroll({ totalCount: 30, pageSize: 8 }));

		unmount();

		expect(observerInstances.every(({ disconnect }) => disconnect.mock.calls.length <= 1)).toBe(true);
	});

	it('IntersectionObserver가 없어도 loadMore로 동작한다', () => {
		vi.stubGlobal('IntersectionObserver', undefined);

		const { result } = renderHook(() => useInfiniteScroll({ totalCount: 30, pageSize: 8 }));

		act(() => result.current.loadMore());

		expect(result.current.visibleCount).toBe(16);
	});

	it('기본 pageSize는 POSTS_PER_PAGE다', () => {
		const { result } = renderHook(() => useInfiniteScroll({ totalCount: 100 }));

		expect(result.current.visibleCount).toBe(POSTS_PER_PAGE);
	});
});

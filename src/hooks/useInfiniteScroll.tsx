'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { POSTS_PER_PAGE } from '@/utils/pagination';

interface UseInfiniteScrollParams {
	totalCount: number;
	pageSize?: number;
	/** 데스크톱처럼 페이지네이션을 쓰는 화면에서는 자동 로드를 끈다. */
	enabled?: boolean;
	/** 검색어처럼 개수가 같아도 목록 내용이 달라지는 경우를 구분하는 키. */
	resetKey?: string;
}

/**
 * 이미 확보된 목록을 페이지 단위로 잘라 보여주고, 센티넬이 뷰포트에 닿으면 다음 페이지를 잇는다.
 * IntersectionObserver를 못 쓰는 환경에서도 loadMore를 버튼에 연결하면 그대로 동작한다.
 */
const useInfiniteScroll = ({
	totalCount,
	pageSize = POSTS_PER_PAGE,
	enabled = true,
	resetKey = '',
}: UseInfiniteScrollParams) => {
	const [visibleCount, setVisibleCount] = useState(() => Math.min(pageSize, totalCount));
	const [listKey, setListKey] = useState(`${totalCount}:${pageSize}:${resetKey}`);
	const sentinelRef = useRef<HTMLDivElement>(null);

	// 카테고리 전환·검색 등으로 목록 자체가 바뀌면 첫 페이지부터 다시 시작한다.
	// 이펙트로 처리하면 한 프레임 동안 이전 개수가 렌더되므로 렌더 중에 보정한다.
	const nextListKey = `${totalCount}:${pageSize}:${resetKey}`;

	if (listKey !== nextListKey) {
		setListKey(nextListKey);
		setVisibleCount(Math.min(pageSize, totalCount));
	}

	const hasMore = visibleCount < totalCount;

	const loadMore = useCallback(() => {
		setVisibleCount(prev => Math.min(prev + pageSize, totalCount));
	}, [pageSize, totalCount]);

	useEffect(() => {
		const sentinel = sentinelRef.current;

		if (!sentinel || !hasMore || !enabled || typeof IntersectionObserver === 'undefined') return;

		const observer = new IntersectionObserver(
			entries => {
				if (entries.some(entry => entry.isIntersecting)) loadMore();
			},
			// 한 화면 앞서 당겨오면 "더 보기" 영역이 한 번도 눈에 띄지 않아 목록이 그냥 길게만 느껴진다.
			// 하단에 거의 닿았을 때 이어붙여 사용자가 이어짐을 인지하게 한다.
			{ rootMargin: '0px 0px 96px 0px' },
		);

		observer.observe(sentinel);

		return () => observer.disconnect();
	}, [hasMore, loadMore, enabled]);

	return { visibleCount, hasMore, loadMore, sentinelRef };
};

export default useInfiniteScroll;

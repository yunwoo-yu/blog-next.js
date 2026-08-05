'use client';

import { useCallback, useEffect, useState } from 'react';

import { toPageNumber } from '@/utils/pagination';

export const QUERY_PARAM = 'q';
export const PAGE_PARAM = 'page';

export interface PostListParams {
	query: string;
	page: number;
}

const EMPTY_PARAMS: PostListParams = { query: '', page: 1 };

/** Safari는 replaceState를 30초당 100회로 제한한다. 타이핑마다 쓰지 않도록 지연시킨다. */
const WRITE_DELAY = 300;

export const parseParams = (search: string): PostListParams => {
	const params = new URLSearchParams(search);

	return {
		query: params.get(QUERY_PARAM) ?? '',
		page: toPageNumber(params.get(PAGE_PARAM)),
	};
};

export const serializeParams = ({ query, page }: PostListParams, search = '') => {
	const params = new URLSearchParams(search);

	if (query) params.set(QUERY_PARAM, query);
	else params.delete(QUERY_PARAM);

	// 1페이지는 기본값이라 URL에 남기지 않는다.
	if (page > 1) params.set(PAGE_PARAM, String(page));
	else params.delete(PAGE_PARAM);

	const next = params.toString();

	return next ? `?${next}` : '';
};

/**
 * 검색어와 페이지를 URL에 실어 뒤로가기·공유가 동작하게 한다.
 *
 * next/navigation의 useSearchParams를 쓰면 정적 프리렌더가 가장 가까운 Suspense fallback으로
 * 대체되어 글 목록이 HTML에서 빠진다(크롤러가 못 봄). History API를 직접 다뤄 정적 HTML을 지킨다.
 * replaceState라 히스토리에 항목이 쌓이지 않으면서도, 글을 열었다 돌아오면 상태가 복원된다.
 */
const usePostListParams = (initial: PostListParams = EMPTY_PARAMS) => {
	// 서버가 searchParams를 읽어 넘겨준 값으로 시작한다.
	// 클라이언트에서 추측하면 서버가 그린 HTML과 어긋나 첫 화면이 한 번 바뀐다.
	const [params, setParams] = useState<PostListParams>(initial);
	const [syncedInitial, setSyncedInitial] = useState<PostListParams>(initial);

	// 라우트 이동으로 서버가 새 값을 내려주면 따라간다.
	if (syncedInitial.query !== initial.query || syncedInitial.page !== initial.page) {
		setSyncedInitial(initial);
		setParams(initial);
	}

	// 뒤로가기·앞으로가기로 URL이 바뀌면 따라간다. 첫 렌더는 서버 값이라 여기서 읽을 필요가 없다.
	useEffect(() => {
		const syncFromUrl = () => setParams(parseParams(window.location.search));

		window.addEventListener('popstate', syncFromUrl);

		return () => window.removeEventListener('popstate', syncFromUrl);
	}, []);

	useEffect(() => {
		const nextSearch = serializeParams(params, window.location.search);

		// 마운트 직후처럼 URL과 이미 같은 상태면 쓰지 않는다.
		if (nextSearch === window.location.search) return;

		const timer = setTimeout(() => {
			window.history.replaceState(null, '', `${window.location.pathname}${nextSearch}`);
		}, WRITE_DELAY);

		return () => clearTimeout(timer);
	}, [params]);

	// 검색어가 바뀌면 보고 있던 페이지는 의미가 없으므로 1페이지로 되돌린다.
	const setQuery = useCallback((query: string) => setParams({ query, page: 1 }), []);

	const setPage = useCallback((page: number) => setParams(prev => ({ ...prev, page })), []);

	return { ...params, setQuery, setPage };
};

export default usePostListParams;

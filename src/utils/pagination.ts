export const POSTS_PER_PAGE = 8;

/** URL·쿼리스트링에서 온 페이지 값은 무엇이든 들어올 수 있다. 항상 1 이상의 정수로 만든다. */
export const toPageNumber = (value?: string | null) => {
	const parsed = Number(value);

	return Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : 1;
};

/** 현재 페이지 주변만 노출하고 나머지는 생략 부호로 접는다. */
export const getPageRange = (page: number, totalPages: number, maxVisible = 5): (number | 'ellipsis')[] => {
	if (totalPages <= maxVisible) return Array.from({ length: totalPages }, (_, index) => index + 1);

	const half = Math.floor(maxVisible / 2);
	const start = Math.min(Math.max(1, page - half), totalPages - maxVisible + 1);
	const pages: (number | 'ellipsis')[] = Array.from({ length: maxVisible }, (_, index) => start + index);

	if (start > 1) pages.splice(0, 2, 1, 'ellipsis');
	if (start + maxVisible - 1 < totalPages) pages.splice(-2, 2, 'ellipsis', totalPages);

	return pages;
};

/**
 * 페이지 번호는 URL에서 오므로 신뢰할 수 없다. 항상 유효 범위로 좁혀서 돌려준다.
 * 검색으로 결과가 줄어 현재 페이지가 사라진 경우도 여기서 흡수된다.
 */
export const getPaginationRange = (totalCount: number, page: number, pageSize = POSTS_PER_PAGE) => {
	const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
	const safePage = Math.min(Math.max(1, Math.floor(page) || 1), totalPages);

	return {
		page: safePage,
		totalPages,
		start: (safePage - 1) * pageSize,
		end: safePage * pageSize,
	};
};

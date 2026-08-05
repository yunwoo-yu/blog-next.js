/** 목록 페이지가 서버에서 읽는 쿼리스트링. 값은 신뢰할 수 없으므로 받는 쪽에서 정규화한다. */
export interface ListSearchParams {
	q?: string;
	page?: string;
}

export interface ListPageParams {
	searchParams: Promise<ListSearchParams>;
}

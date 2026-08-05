import { getPageRange, getPaginationRange, POSTS_PER_PAGE, toPageNumber } from './pagination';

describe('toPageNumber', () => {
	it('정상 값은 그대로 읽는다', () => {
		expect(toPageNumber('3')).toBe(3);
	});

	it('없거나 비어 있으면 1이다', () => {
		expect(toPageNumber()).toBe(1);
		expect(toPageNumber(null)).toBe(1);
		expect(toPageNumber('')).toBe(1);
	});

	it('숫자가 아니면 1이다', () => {
		expect(toPageNumber('abc')).toBe(1);
	});

	it('0 이하는 1로 올린다', () => {
		expect(toPageNumber('0')).toBe(1);
		expect(toPageNumber('-2')).toBe(1);
	});

	it('소수는 내림한다', () => {
		expect(toPageNumber('2.9')).toBe(2);
	});
});

describe('getPageRange', () => {
	it('전체 페이지가 최대 노출 수 이하면 전부 보여준다', () => {
		expect(getPageRange(1, 4)).toEqual([1, 2, 3, 4]);
	});

	it('앞쪽 페이지에서는 뒤를 생략한다', () => {
		expect(getPageRange(1, 10)).toEqual([1, 2, 3, 'ellipsis', 10]);
	});

	it('가운데 페이지에서는 양쪽을 생략한다', () => {
		expect(getPageRange(5, 10)).toEqual([1, 'ellipsis', 5, 'ellipsis', 10]);
	});

	it('뒤쪽 페이지에서는 앞을 생략한다', () => {
		expect(getPageRange(10, 10)).toEqual([1, 'ellipsis', 8, 9, 10]);
	});

	it('항상 첫 페이지와 마지막 페이지를 포함한다', () => {
		const range = getPageRange(6, 20);

		expect(range[0]).toBe(1);
		expect(range.at(-1)).toBe(20);
	});
});

describe('getPaginationRange', () => {
	it('첫 페이지는 처음 pageSize개를 가리킨다', () => {
		expect(getPaginationRange(30, 1, 8)).toEqual({ page: 1, totalPages: 4, start: 0, end: 8 });
	});

	it('페이지에 따라 구간이 움직인다', () => {
		expect(getPaginationRange(30, 3, 8)).toMatchObject({ start: 16, end: 24 });
	});

	it('총 페이지 수를 올림으로 계산한다', () => {
		expect(getPaginationRange(30, 1, 8).totalPages).toBe(4);
	});

	it('글이 없어도 총 페이지는 최소 1이다', () => {
		expect(getPaginationRange(0, 1, 8).totalPages).toBe(1);
	});

	it('범위를 넘는 페이지는 마지막 페이지로 좁힌다', () => {
		expect(getPaginationRange(30, 99, 8).page).toBe(4);
	});

	it('0이나 음수 페이지는 1로 좁힌다', () => {
		expect(getPaginationRange(30, 0, 8).page).toBe(1);
		expect(getPaginationRange(30, -5, 8).page).toBe(1);
	});

	it('URL에서 온 소수·NaN 페이지도 안전하게 처리한다', () => {
		expect(getPaginationRange(30, 2.7, 8).page).toBe(2);
		expect(getPaginationRange(30, Number.NaN, 8).page).toBe(1);
	});

	it('검색으로 결과가 줄면 현재 페이지를 마지막 페이지로 흡수한다', () => {
		expect(getPaginationRange(4, 3, 8)).toMatchObject({ page: 1, totalPages: 1, start: 0, end: 8 });
	});

	it('기본 pageSize는 POSTS_PER_PAGE다', () => {
		expect(getPaginationRange(100, 1).end).toBe(POSTS_PER_PAGE);
	});
});

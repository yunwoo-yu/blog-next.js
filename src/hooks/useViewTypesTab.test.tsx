// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';

import { VIEW_TYPE_COOKIE } from '@/utils/view-type';

import useViewTypesTab from './useViewTypesTab';

const readCookie = (name: string) =>
	document.cookie
		.split('; ')
		.find(entry => entry.startsWith(`${name}=`))
		?.split('=')[1];

describe('useViewTypesTab', () => {
	beforeEach(() => {
		document.cookie = `${VIEW_TYPE_COOKIE}=; path=/; max-age=0`;
	});

	it('초기값을 안 주면 list로 시작한다', () => {
		const { result } = renderHook(() => useViewTypesTab());

		expect(result.current.viewType).toBe('list');
	});

	it('서버가 넘긴 초기값으로 시작한다', () => {
		const { result } = renderHook(() => useViewTypesTab('card'));

		expect(result.current.viewType).toBe('card');
	});

	it('토글하면 card로 변경된다', () => {
		const { result } = renderHook(() => useViewTypesTab());

		act(() => result.current.onChangeViewType());

		expect(result.current.viewType).toBe('card');
	});

	it('두 번 토글하면 list로 돌아온다', () => {
		const { result } = renderHook(() => useViewTypesTab());

		act(() => result.current.onChangeViewType());
		act(() => result.current.onChangeViewType());

		expect(result.current.viewType).toBe('list');
	});

	it('토글하면 쿠키에 저장해 다음 요청의 서버 렌더에 반영되게 한다', () => {
		const { result } = renderHook(() => useViewTypesTab());

		act(() => result.current.onChangeViewType());

		expect(readCookie(VIEW_TYPE_COOKIE)).toBe('card');
	});
});

// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';

import useViewTypesTab from './useViewTypesTab';

describe('useViewTypesTab', () => {
	it('초기 viewType은 list이다', () => {
		const { result } = renderHook(() => useViewTypesTab());

		expect(result.current.viewType).toBe('list');
	});

	it('토글하면 card로 변경된다', () => {
		const { result } = renderHook(() => useViewTypesTab());

		act(() => {
			result.current.onChangeViewType();
		});

		expect(result.current.viewType).toBe('card');
	});

	it('두 번 토글하면 list로 돌아온다', () => {
		const { result } = renderHook(() => useViewTypesTab());

		act(() => {
			result.current.onChangeViewType();
		});
		act(() => {
			result.current.onChangeViewType();
		});

		expect(result.current.viewType).toBe('list');
	});
});

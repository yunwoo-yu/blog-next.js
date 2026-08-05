'use client';

import { startTransition, useState } from 'react';

import { VIEW_TYPE_COOKIE, VIEW_TYPE_MAX_AGE, type ViewType } from '@/utils/view-type';

const useViewTypesTab = (initialViewType: ViewType = 'list') => {
	// 서버가 쿠키에서 읽어 넘겨준 값으로 시작하므로 첫 화면이 바뀌지 않는다.
	const [viewType, setViewType] = useState<ViewType>(initialViewType);

	const onChangeViewType = () => {
		startTransition(() => {
			setViewType(prev => {
				const next = prev === 'list' ? 'card' : 'list';

				document.cookie = `${VIEW_TYPE_COOKIE}=${next}; path=/; max-age=${VIEW_TYPE_MAX_AGE}; samesite=lax`;

				return next;
			});
		});
	};

	return { viewType, onChangeViewType };
};

export default useViewTypesTab;

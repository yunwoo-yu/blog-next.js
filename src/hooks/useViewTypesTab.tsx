'use client';

import { useState } from 'react';

export type ViewType = 'list' | 'card';

const useViewTypesTab = () => {
	const [viewType, setViewType] = useState<ViewType>('list');

	const onChangeViewType = () => {
		setViewType(prev => {
			const nextViewType = prev === 'list' ? 'card' : 'list';

			return nextViewType;
		});
	};

	return { viewType, onChangeViewType };
};

export default useViewTypesTab;

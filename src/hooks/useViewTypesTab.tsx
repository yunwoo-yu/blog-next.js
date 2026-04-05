'use client';

import { startTransition, useState } from 'react';

export type ViewType = 'list' | 'card';

const useViewTypesTab = () => {
	const [viewType, setViewType] = useState<ViewType>('list');

	const onChangeViewType = () => {
		startTransition(() => {
			setViewType(prev => (prev === 'list' ? 'card' : 'list'));
		});
	};

	return { viewType, onChangeViewType };
};

export default useViewTypesTab;

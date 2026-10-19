import type { ReactNode } from 'react';

import { buildCasePath, type PortfolioCase } from '@/portfolio/cases';
import { getExhibit, getStageScreen } from '@/portfolio/exhibits';

import { ListRow, Thumbnail } from './ui';

interface CaseRowProps {
	item: PortfolioCase;
	/** 기본값은 "서비스 · 기간" */
	description?: ReactNode;
}

/** 사례 한 줄. 공개 화면 캡처가 있으면 썸네일로, 없으면 회색 면을 둔다. */
const CaseRow = ({ item, description }: CaseRowProps) => {
	const exhibit = getExhibit(item.slug);
	const screen = exhibit && getStageScreen(exhibit, 'after');

	return (
		<ListRow
			href={buildCasePath(item.slug)}
			leading={<Thumbnail screen={screen} />}
			title={item.title}
			description={description ?? [item.service, item.period].filter(Boolean).join(' · ')}
		/>
	);
};

export default CaseRow;

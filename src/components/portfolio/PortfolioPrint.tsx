import Link from 'next/link';
import { PORTFOLIO_PATH } from '@/portfolio/links';
import { getPrintFeatured } from '@/portfolio/print';

import PrintButton from './PrintButton';
import PrintCase from './PrintCase';
import PrintCover from './PrintCover';
import PrintOthers from './PrintOthers';
import PrintPageStyle from './PrintPageStyle';
import { Column, TEXT_LINK_CLASS } from './ui';

/** 한 번에 PDF 로 저장하는 인쇄용 문서: 표지 → 대표 사례(각 2쪽) → 그 밖의 작업. 인쇄 스타일은 포트폴리오 스타일시트의 .pf-print. */
const PortfolioPrint = () => (
	<div className="pf-print">
		<PrintPageStyle />
		<Column className="flex flex-wrap items-center justify-between gap-3 py-4 print:hidden">
			<Link href={PORTFOLIO_PATH} className={`${TEXT_LINK_CLASS} text-[15px]`}>
				← 포트폴리오로
			</Link>
			<PrintButton />
		</Column>

		<PrintCover />
		{getPrintFeatured().map(({ item, ...entry }, index) => (
			<PrintCase key={item.slug} item={item} entry={entry} index={index} />
		))}
		<PrintOthers />
	</div>
);

export default PortfolioPrint;

import Link from 'next/link';
import { PORTFOLIO_PATH } from '@/portfolio/links';
import { getPrintFeatured } from '@/portfolio/print';
import { cn } from '@/utils/utils';

import PrintButton from './PrintButton';
import PrintCase from './PrintCase';
import PrintCover from './PrintCover';
import PrintOthers from './PrintOthers';
import PrintPageStyle from './PrintPageStyle';
import { Column, TEXT_LINK_CLASS } from './ui';

/**
 * 인쇄 문서의 바탕. pf-print 는 스타일이 아니라 표식이다(포트폴리오 스타일시트가 reduced-motion 에서 이 안의 transform 을 지우지 않도록 알아본다).
 * 이름 붙은 쪽 [page:pf-print] 은 포트폴리오 스타일시트의 @page 규칙과 짝이다.
 * 아래 하위 선택자는 전역 규칙 보정이다: 글 본문용 `article p` 의 넓은 줄 간격을 되돌린다.
 */
const PRINT_ROOT_CLASS = cn(
	'pf-print mx-auto max-w-[174mm] px-[4mm] pb-[12mm] print:max-w-none print:p-0',
	'break-keep text-[10pt] leading-[1.6] text-print-ink-2 [page:pf-print] [print-color-adjust:exact]',
	'[&_:is(h1,h2,h3,h4)]:break-after-avoid',
	'[&_a]:text-print-accent [&_a]:underline [&_a]:[overflow-wrap:anywhere]',
	'[&_p]:[line-height:inherit] [&_p]:[orphans:3] [&_p]:[widows:3]',
);

/** 한 번에 PDF 로 저장하는 인쇄용 문서: 표지 → 대표 사례(각 2쪽) → 그 밖의 작업. */
const PortfolioPrint = () => (
	<div className={PRINT_ROOT_CLASS}>
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

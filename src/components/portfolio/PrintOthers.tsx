import { getPrintOthers, getPrintReferences, PRINT_PORTFOLIO_URL } from '@/portfolio/print';

import { cn } from '@/utils/utils';

import PrintContacts from './PrintContacts';
import { CONTACT_LABEL_CLASS, PrintBlock, PrintSheet } from './PrintParts';

const CELL_CLASS = 'border-t-[0.5pt] border-print-rule py-[3mm] pl-0 pr-[2mm] text-left align-top';
const HEAD_CELL_CLASS = cn(CELL_CLASS, 'border-b-[0.75pt] border-t-0 border-b-print-ink text-[9pt] text-print-ink-3');

/** 마지막 쪽: 대표 사례 밖의 작업 표, 기술 자료 링크, 연락처. */
const PrintOthers = () => {
	const others = getPrintOthers();

	return (
		<PrintSheet data-print-page="others" data-print-others aria-labelledby="print-others-title">
			<h2
				id="print-others-title"
				className="border-t-[2pt] border-print-ink pt-[3mm] text-[18pt] font-bold text-print-ink">
				그 밖의 작업
			</h2>
			<table className="mt-[5mm] w-full table-fixed border-collapse text-[9.5pt] leading-[1.5]">
				<caption className="sr-only">대표 사례 밖에서 한 작업 {others.length}건</caption>
				<colgroup>
					<col className="w-[18mm]" />
					<col className="w-[34mm]" />
					<col />
					<col className="w-[52mm]" />
				</colgroup>
				<thead>
					<tr>
						{['회사', '기간', '작업', '핵심'].map(heading => (
							<th key={heading} scope="col" className={HEAD_CELL_CLASS}>
								{heading}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{others.map(({ item, line }) => (
						<tr key={item.slug} data-other-item={item.slug} className="min-h-[12mm] break-inside-avoid">
							<td className={CELL_CLASS}>{item.organization}</td>
							<td className={CELL_CLASS}>{item.period}</td>
							<th scope="row" className={cn(CELL_CLASS, 'font-bold text-print-ink')}>
								{item.title}
							</th>
							<td className={CELL_CLASS}>{line}</td>
						</tr>
					))}
				</tbody>
			</table>

			<PrintBlock id="print-refs-title" title="더 확인할 수 있는 기술 자료" className="break-inside-avoid">
				<ul>
					{getPrintReferences().map(ref => (
						<li key={ref.url} className="mt-[3mm] break-inside-avoid">
							<p>
								<span className={cn(CONTACT_LABEL_CLASS, 'mr-[3mm]')}>{ref.label}</span>
								<a href={ref.url} className="text-[8.5pt]">
									{ref.url}
								</a>
							</p>
							<p className="mt-[0.5mm] text-[9.5pt]">이 글에서 확인할 판단: {ref.point}</p>
						</li>
					))}
				</ul>
			</PrintBlock>

			<PrintBlock id="print-contact-title" title="연락처" className="break-inside-avoid">
				<PrintContacts />
				<p className="mt-[1mm] text-[9.5pt]">
					<span className={cn(CONTACT_LABEL_CLASS, 'mr-[3mm]')}>웹 포트폴리오</span>
					<a href={PRINT_PORTFOLIO_URL}>{PRINT_PORTFOLIO_URL}</a>
				</p>
			</PrintBlock>
		</PrintSheet>
	);
};

export default PrintOthers;

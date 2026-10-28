import { getPrintOthers, getPrintReferences, PRINT_GLOSSARY, PRINT_PORTFOLIO_URL } from '@/portfolio/print';
import { cn } from '@/utils/utils';

import PrintContacts from './PrintContacts';
import { CONTACT_LABEL_CLASS, PrintBlock, PrintSheet } from './PrintParts';

const CELL_CLASS = 'border-t-[0.5pt] border-print-rule py-[2mm] pl-0 pr-[2mm] text-left align-top';
const HEAD_CELL_CLASS = cn(CELL_CLASS, 'border-b-[0.75pt] border-t-0 border-b-print-ink text-[9pt] text-print-ink-3');

/** 마지막 쪽: 대표 사례 밖의 작업 표, 기술 자료 링크, 연락처, 용어 풀이. */
const PrintOthers = () => {
	const others = getPrintOthers();

	return (
		<PrintSheet
			data-print-page="others"
			data-print-others
			aria-labelledby="print-others-title"
			className="flex flex-col">
			<h2
				id="print-others-title"
				className="border-t-[2pt] border-print-ink pt-[3mm] text-[18pt] font-bold text-print-ink">
				그 밖의 작업
			</h2>
			<table className="mt-[5mm] w-full table-fixed border-collapse text-[9pt] leading-[1.4]">
				<caption className="sr-only">대표 사례 밖에서 한 작업 {others.length}건</caption>
				<colgroup>
					<col className="w-[18mm]" />
					<col className="w-[34mm]" />
					<col />
					<col className="w-[65mm]" />
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
							<p className="mt-[0.5mm] text-[9.5pt]">
								{ref.pointLabel}: {ref.point}
							</p>
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
			<section
				aria-labelledby="print-glossary-title"
				className="mt-auto break-inside-avoid pt-[3mm] text-[8pt] leading-[1.35] text-print-ink-3">
				<h3
					id="print-glossary-title"
					className="mb-[1mm] border-t-[0.5pt] border-print-rule pt-[2mm] font-bold text-print-ink">
					자주 나오는 용어
				</h3>
				<dl>
					{PRINT_GLOSSARY.map(({ term, description }) => (
						<div key={term} className="flex gap-[2mm]">
							<dt className="w-[25mm] shrink-0 font-bold">{term}</dt>
							<dd>{description}</dd>
						</div>
					))}
				</dl>
			</section>
		</PrintSheet>
	);
};

export default PrintOthers;

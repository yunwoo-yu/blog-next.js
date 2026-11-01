import { getPrintOthers, getPrintReferences, PRINT_PORTFOLIO_URL } from '@/portfolio/print';
import { cn } from '@/utils/utils';

import PrintContacts from './PrintContacts';
import { CONTACT_LABEL_CLASS, PrintBlock, PrintSheet } from './PrintParts';

/** 마지막 쪽: 대표 사례 밖의 작업(사례당 한 줄), 글·오픈소스 링크, 연락처. */
const PrintOthers = () => {
	const others = getPrintOthers();

	return (
		<PrintSheet
			data-print-page="others"
			data-print-others
			aria-labelledby="print-others-title"
			className="print:min-h-0">
			<h2
				id="print-others-title"
				className="border-t-[2pt] border-print-ink pt-[3mm] text-[17pt] font-bold text-print-ink">
				그 밖의 작업
			</h2>
			<ul className="mt-[3mm]" aria-label={`대표 사례 밖에서 한 작업 ${others.length}건`}>
				{others.map(({ item, line }) => (
					<li
						key={item.slug}
						data-other-item={item.slug}
						className="break-inside-avoid border-t-[0.5pt] border-print-rule py-[2.5mm] first:border-t-0">
						<p className="text-[10pt] font-bold text-print-ink">
							{item.title}
							<span className="ml-[2mm] text-[9pt] font-normal text-print-ink-3">
								{item.organization} · {item.period}
							</span>
						</p>
						<p className="mt-[0.5mm] max-w-[160mm] text-[9.5pt]">{line}</p>
					</li>
				))}
			</ul>

			<PrintBlock id="print-refs-title" title="글·오픈소스" className="break-inside-avoid">
				<ul>
					{getPrintReferences().map(ref => (
						<li key={ref.url} className="mt-[2mm] break-inside-avoid text-[9.5pt]">
							<p>
								<span className={cn(CONTACT_LABEL_CLASS, 'mr-[3mm]')}>{ref.label}</span>
								{ref.point}
							</p>
							<a href={ref.url} className="text-[8.5pt]">
								{ref.url}
							</a>
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

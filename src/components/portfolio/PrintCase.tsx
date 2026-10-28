import { renderRichText } from '@/components/resume/highlight';
import type { PortfolioCase } from '@/portfolio/cases';
import { getPrintDecisionRows, getPrintResultSentences, getPrintTroubles, type PrintFeatured } from '@/portfolio/print';
import { cn } from '@/utils/utils';
import { splitParagraphs } from './Paragraphs';
import PrintDiagram from './PrintDiagram';
import { PrintBlock, PrintSheet } from './PrintParts';

interface PrintCaseProps {
	item: PortfolioCase;
	entry: PrintFeatured;
	/** 0부터 센 대표 사례 순서 */
	index: number;
}

/** "문제"·"해결" 본문. 이력서 원문의 강조 문구는 굵게 그린다. */
const StageText = ({ text, highlights }: { text: string; highlights: string[] }) => (
	<>
		{splitParagraphs(text).map(paragraph => (
			<p key={paragraph}>{renderRichText(paragraph, highlights, [], '')}</p>
		))}
	</>
);

const REASON_CELL_CLASS = 'border-t-[0.5pt] border-print-rule py-[2mm] pl-0 pr-[2mm] text-left align-top';
const REASON_HEAD_CLASS = cn(
	REASON_CELL_CLASS,
	'border-b-[0.75pt] border-t-0 border-b-print-ink font-bold text-print-ink-3',
);

const circled = (index: number) => String.fromCodePoint(0x2460 + index);

/** 사례 한 건 = 정확히 2쪽. A쪽: 머리·한 줄 성과·문제·해결·선택 이유, B쪽: 풀었던 문제·도식·결과·한계. */
const PrintCase = ({ item, entry, index }: PrintCaseProps) => {
	const number = String(index + 1).padStart(2, '0');
	const problem = item.stages.find(stage => stage.id === 'problem');
	const solution = item.stages.find(stage => stage.id === 'contribution');
	const result = item.stages.find(stage => stage.id === 'result');
	const decisions = getPrintDecisionRows(item.slug);
	const troubles = getPrintTroubles(item.slug);
	const resultSentences = result ? getPrintResultSentences(result.text, entry.evidence) : [];
	const titleId = `print-case-${item.slug}`;

	return (
		<article data-print-case={item.slug} aria-labelledby={titleId}>
			<PrintSheet data-print-page="case-a">
				<header className="flex items-baseline gap-[3mm] border-t-[2pt] border-print-ink pt-[3mm]">
					<span className="text-[28pt] font-bold leading-none tabular-nums text-print-rule" aria-hidden="true">
						{number}
					</span>
					<span className="rounded-[1mm] border-[0.75pt] border-print-ink px-[2mm] py-[0.3mm] text-[9pt] font-bold text-print-ink">
						{item.organization}
					</span>
					<span className="text-[9.5pt] text-print-ink-3">
						{[item.service, item.period].filter(Boolean).join(' · ')}
					</span>
				</header>
				<h2 id={titleId} className="mt-[4mm] max-w-[160mm] text-[18pt] font-bold leading-[1.4] text-print-ink">
					{item.title}
				</h2>

				<div
					data-print-oneline
					className="mt-[8mm] break-inside-avoid border-l-[3pt] border-print-ink bg-print-fill px-[5mm] py-[4mm]">
					<p className="text-[11pt] font-semibold text-print-ink">{entry.oneLine}</p>
					{entry.evidence && (
						<p className="mt-[2mm] text-[9.5pt]" data-print-evidence>
							<span
								data-print-tag
								className="mr-[2mm] border-[0.75pt] border-print-ink px-[1.5mm] text-[8pt] font-bold text-print-ink">
								{entry.evidence.tag}
							</span>
							{entry.evidence.text}
						</p>
					)}
				</div>

				{problem && (
					<PrintBlock id={`${titleId}-problem`} title="문제" className="break-inside-avoid">
						<StageText text={problem.text} highlights={problem.highlights} />
					</PrintBlock>
				)}

				{solution && (
					<PrintBlock id={`${titleId}-solution`} title="해결">
						<StageText text={solution.text} highlights={solution.highlights} />
					</PrintBlock>
				)}

				{decisions.length > 0 && (
					<PrintBlock id={`${titleId}-reason`} title="선택 이유" subhead className="break-inside-avoid">
						<table
							className="w-full break-inside-avoid border-collapse text-[9pt] leading-[1.5] [&_strong]:!text-print-ink"
							data-print-reasons>
							<thead>
								<tr>
									<th scope="col" className={REASON_HEAD_CLASS}>
										질문
									</th>
									<th scope="col" className={REASON_HEAD_CLASS}>
										선택
									</th>
								</tr>
							</thead>
							<tbody>
								{decisions.map(row => (
									<tr key={row.question}>
										<th scope="row" className={cn(REASON_CELL_CLASS, 'w-[48mm] font-bold text-print-ink')}>
											{row.question}
										</th>
										<td className={cn(REASON_CELL_CLASS, '[&_p+p]:mt-[1mm]')}>
											{row.chosen.map(option => (
												<p key={option.name}>
													<strong>{option.name}</strong> {option.reason}
												</p>
											))}
											{row.alternative && <p className="text-print-ink-3">대안: {row.alternative}</p>}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</PrintBlock>
				)}
			</PrintSheet>

			<PrintSheet data-print-page="case-b" aria-label={`${item.title} (계속)`}>
				<p className="border-b-[0.5pt] border-print-rule text-[8pt] text-print-ink-3">
					{number} {item.title} (계속)
				</p>

				{troubles.length > 0 && (
					<PrintBlock id={`${titleId}-troubles`} title="풀었던 문제">
						<ol>
							{troubles.map((trouble, order) => (
								<li
									key={trouble.problem}
									className={cn(
										'break-inside-avoid [&>p]:max-w-[160mm]',
										order > 0 && 'mt-[9mm] border-t-[0.5pt] border-print-rule pt-[8mm]',
									)}
									data-testid="trouble">
									<h4 className="mb-[2mm] text-[11pt] font-bold text-print-ink">
										<span aria-hidden="true">{circled(order)} </span>
										{trouble.problem}
									</h4>
									{trouble.diagram ? (
										<PrintDiagram diagram={trouble.diagram} />
									) : (
										<StageText text={trouble.fix} highlights={[]} />
									)}
								</li>
							))}
						</ol>
					</PrintBlock>
				)}

				<div className="mt-[11mm] break-inside-avoid">
					{resultSentences.length > 0 && (
						<PrintBlock id={`${titleId}-result`} title="결과" className="mt-0">
							<p>{resultSentences.join(' ')}</p>
						</PrintBlock>
					)}
					<PrintBlock
						id={`${titleId}-limit`}
						title="한계"
						subhead
						className="mt-[8mm] border-t-[0.5pt] border-print-rule pt-[6mm]">
						<p>{entry.limit}</p>
					</PrintBlock>
				</div>
			</PrintSheet>
		</article>
	);
};

export default PrintCase;

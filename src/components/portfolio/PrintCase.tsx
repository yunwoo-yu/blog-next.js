import { renderRichText } from '@/components/resume/highlight';
import type { PortfolioCase } from '@/portfolio/cases';
import { getExampleScreen } from '@/portfolio/examples';
import { getPrintTroubles, type PrintFeatured } from '@/portfolio/print';
import { cn } from '@/utils/utils';

import ExampleScreen from './ExampleScreen';
import { splitParagraphs } from './Paragraphs';
import PrintDiagram from './PrintDiagram';
import { PrintBlock, PrintSheet } from './PrintParts';

interface PrintCaseProps {
	item: PortfolioCase;
	entry: PrintFeatured;
	/** 0부터 센 대표 사례 순서 */
	index: number;
}

/** "문제"·"해결"·"결과" 본문. 이력서 원문의 강조 문구는 굵게 그린다. */
const StageText = ({ text, highlights }: { text: string; highlights: string[] }) => (
	<>
		{splitParagraphs(text).map(paragraph => (
			<p key={paragraph}>{renderRichText(paragraph, highlights, [], '')}</p>
		))}
	</>
);

/**
 * 사례 한 건. 새 쪽에서 시작해 내용만큼 이어진다(쪽 수를 고정하지 않는다).
 * 순서: 머리·한 줄 요약 → 문제 → 해결 → 구현 포인트(도식) → 예시 화면·결과. 블록마다 쪽 사이에서 잘리지 않게 한다.
 */
const PrintCase = ({ item, entry, index }: PrintCaseProps) => {
	const number = String(index + 1).padStart(2, '0');
	const problem = item.stages.find(stage => stage.id === 'problem');
	const solution = item.stages.find(stage => stage.id === 'contribution');
	const result = item.stages.find(stage => stage.id === 'result');
	const troubles = getPrintTroubles(item.slug);
	const titleId = `print-case-${item.slug}`;
	const example = getExampleScreen(item.slug);

	return (
		<article data-print-case={item.slug} aria-labelledby={titleId}>
			<PrintSheet data-print-page="case" className="print:min-h-0">
				<header className="flex items-baseline gap-[3mm] border-t-[2pt] border-print-ink pt-[3mm]">
					<span className="text-[20pt] font-bold leading-none tabular-nums text-print-num" aria-hidden="true">
						{number}
					</span>
					<span className="text-[9.5pt] text-print-ink-3">
						<span className="font-bold text-print-ink">{item.organization}</span>
						{' · '}
						{[item.service, item.period].filter(Boolean).join(' · ')}
					</span>
				</header>
				<h2 id={titleId} className="mt-[2mm] max-w-[160mm] text-[16pt] font-bold leading-[1.4] text-print-ink">
					{item.title}
				</h2>

				<p
					data-print-oneline
					className="mt-[4mm] max-w-[160mm] break-inside-avoid border-l-[3pt] border-print-ink pl-[4mm] text-[10pt] font-semibold text-print-ink">
					{entry.oneLine}
				</p>

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

				{troubles.length > 0 && (
					<PrintBlock id={`${titleId}-troubles`} title="구현 포인트">
						<ul>
							{troubles.map((trouble, order) => (
								<li
									key={trouble.problem}
									className={cn(
										'break-inside-avoid [&>p]:max-w-[160mm]',
										order > 0 && 'mt-[3mm] border-t-[0.5pt] border-print-rule pt-[3mm]',
									)}
									data-testid="trouble">
									<h4 className="mb-[1mm] text-[10pt] font-bold text-print-ink">{trouble.problem}</h4>
									{trouble.diagram ? (
										<PrintDiagram diagram={trouble.diagram} />
									) : (
										<StageText text={trouble.fix} highlights={[]} />
									)}
								</li>
							))}
						</ul>
					</PrintBlock>
				)}

				{/* 구현 포인트 아래에 가상의 예시 화면(왼쪽)과 결과(오른쪽)를 나란히 둬 높이를 아낀다. 읽는 순서는 예시 → 결과. */}
				<div
					className={cn(
						'mt-[4mm] break-inside-avoid',
						example && 'grid grid-cols-[105mm_minmax(0,1fr)] items-start gap-[6mm]',
					)}>
					{example && <ExampleScreen example={example} variant="print" className="break-inside-avoid" />}
					{result && (
						<PrintBlock id={`${titleId}-result`} title="결과" className="mt-0 break-inside-avoid">
							<StageText text={result.text} highlights={result.highlights} />
						</PrintBlock>
					)}
				</div>
			</PrintSheet>
		</article>
	);
};

export default PrintCase;

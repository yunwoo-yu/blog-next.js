import { renderRichText } from '@/components/resume/highlight';
import type { PortfolioCase } from '@/portfolio/cases';
import { getPrintDecisionRows, getPrintResultSentences, getPrintTroubles, type PrintFeatured } from '@/portfolio/print';
import { splitParagraphs } from './Paragraphs';
import PrintDiagram from './PrintDiagram';

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
			<p key={paragraph}>{renderRichText(paragraph, highlights, [], 'pf-link')}</p>
		))}
	</>
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
			<section data-print-page="case-a" className="pf-sheet pf-sheet-break">
				<header className="pf-case-head">
					<span className="pf-case-num" aria-hidden="true">
						{number}
					</span>
					<span className="pf-org">{item.organization}</span>
					<span className="pf-case-meta">{[item.service, item.period].filter(Boolean).join(' · ')}</span>
				</header>
				<h2 id={titleId} className="pf-case-title">
					{item.title}
				</h2>

				<div className="pf-oneline" data-print-oneline>
					<p className="pf-oneline-text">{entry.oneLine}</p>
					{entry.evidence && (
						<p className="pf-evidence" data-print-evidence>
							<span className="pf-tag">{entry.evidence.tag}</span>
							{entry.evidence.text}
						</p>
					)}
				</div>

				{problem && (
					<section className="pf-block pf-keep" aria-labelledby={`${titleId}-problem`}>
						<h3 id={`${titleId}-problem`}>문제</h3>
						<StageText text={problem.text} highlights={problem.highlights} />
					</section>
				)}

				{solution && (
					<section className="pf-block" aria-labelledby={`${titleId}-solution`}>
						<h3 id={`${titleId}-solution`}>해결</h3>
						<StageText text={solution.text} highlights={solution.highlights} />
					</section>
				)}

				{decisions.length > 0 && (
					<section className="pf-block pf-keep" aria-labelledby={`${titleId}-reason`}>
						<h4 id={`${titleId}-reason`}>선택 이유</h4>
						<table className="pf-reasons" data-print-reasons>
							<thead>
								<tr>
									<th scope="col">질문</th>
									<th scope="col">선택</th>
								</tr>
							</thead>
							<tbody>
								{decisions.map(row => (
									<tr key={row.question}>
										<th scope="row">{row.question}</th>
										<td>
											{row.chosen.map(option => (
												<p key={option.name}>
													<strong>{option.name}</strong> {option.reason}
												</p>
											))}
											{row.alternative && <p className="pf-alt">대안: {row.alternative}</p>}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</section>
				)}
			</section>

			<section data-print-page="case-b" className="pf-sheet pf-sheet-break" aria-label={`${item.title} (계속)`}>
				<p className="pf-running">
					{number} {item.title} (계속)
				</p>

				{troubles.length > 0 && (
					<section className="pf-block" aria-labelledby={`${titleId}-troubles`}>
						<h3 id={`${titleId}-troubles`}>풀었던 문제</h3>
						<ol className="pf-troubles">
							{troubles.map((trouble, order) => (
								<li key={trouble.problem} className="pf-keep" data-testid="trouble">
									<h4>
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
					</section>
				)}

				<div className="pf-keep pf-end">
					{resultSentences.length > 0 && (
						<section className="pf-block" aria-labelledby={`${titleId}-result`}>
							<h3 id={`${titleId}-result`}>결과</h3>
							<p>{resultSentences.join(' ')}</p>
						</section>
					)}
					<section className="pf-limit" aria-labelledby={`${titleId}-limit`}>
						<h4 id={`${titleId}-limit`}>한계</h4>
						<p>{entry.limit}</p>
					</section>
				</div>
			</section>
		</article>
	);
};

export default PrintCase;

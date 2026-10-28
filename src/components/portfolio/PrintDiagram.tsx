import type { SequenceDiagram } from '@/portfolio/stories';
import DiagramReadout from './DiagramReadout';
import { centerOf, getLabelSpan, getTone, TONE_LABEL } from './diagram';

/**
 * 인쇄용 시퀀스 도식. 흑백으로 뽑아도 구분되도록 선 모양으로 뜻을 나눈다
 * (문제: 붉은 점선·열린 화살촉, 해결: 파란 굵은 실선·채운 화살촉, 일반: 회색 실선). 모양은 포트폴리오 스타일시트의 .pf-dg-* 규칙.
 * 서버 컴포넌트이고 등장 효과가 없다.
 */
const PrintDiagram = ({ diagram }: { diagram: SequenceDiagram }) => {
	const { actors, steps } = diagram;
	const count = actors.length;
	const columns = { gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` };

	return (
		<figure className="pf-dg" data-testid="sequence-diagram">
			<div aria-hidden="true" className="pf-dg-visual">
				<div className="pf-dg-actors" style={columns}>
					{actors.map(actor => (
						<span key={actor} className="pf-dg-actor">
							{actor}
						</span>
					))}
				</div>
				<div className="pf-dg-body">
					{actors.map((actor, index) => (
						<span key={actor} className="pf-dg-life" style={{ left: centerOf(count, index) }} />
					))}
					<ol className="pf-dg-steps">
						{steps.map((step, index) => {
							const tone = getTone(step);
							const { start, end, rightward, self } = getLabelSpan(count, step);
							const low = Math.min(step.from, step.to);
							const high = Math.max(step.from, step.to);
							const chip = TONE_LABEL[tone];

							return (
								<li key={`${step.label}-${index}`} className={`pf-dg-step pf-dg-${tone}`} data-testid="sequence-step">
									<div className="pf-dg-row" style={columns}>
										<p
											className="pf-dg-label"
											style={{
												gridColumn: `${start + 1} / ${end + 2}`,
												textAlign: self || rightward ? 'left' : 'right',
											}}>
											<span className="pf-dg-text">
												{chip && <span className={`pf-dg-chip pf-dg-chip-${tone}`}>{chip}</span>}
												{step.label}
											</span>
										</p>
									</div>
									<span className="pf-dg-arrow">
										{self ? (
											<>
												<span className="pf-dg-loop" style={{ left: centerOf(count, step.from) }} />
												<span
													className="pf-dg-head pf-dg-head-left pf-dg-head-loop"
													style={{ left: centerOf(count, step.from) }}
												/>
											</>
										) : (
											<>
												<span
													className="pf-dg-shaft"
													style={{
														left: centerOf(count, low),
														width: `calc(${centerOf(count, high)} - ${centerOf(count, low)})`,
													}}
												/>
												<span
													className={`pf-dg-head ${rightward ? 'pf-dg-head-right' : 'pf-dg-head-left'}`}
													style={{ left: rightward ? centerOf(count, high) : centerOf(count, low) }}
												/>
											</>
										)}
									</span>
								</li>
							);
						})}
					</ol>
				</div>
			</div>
			<DiagramReadout diagram={diagram} />
		</figure>
	);
};

export default PrintDiagram;

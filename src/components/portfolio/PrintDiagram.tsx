import type { SequenceDiagram } from '@/portfolio/stories';
import { cn } from '@/utils/utils';
import DiagramReadout from './DiagramReadout';
import { centerOf, getLabelSpan, getTone, TONE_LABEL, type Tone } from './diagram';

/**
 * 단계 종류별 선 색(--c)과 굵기(--w). 같은 값을 줄·화살촉·고리가 함께 쓰므로 li 에 변수로 둔다.
 * 흑백으로 뽑아도 구분되도록 모양으로도 뜻을 나눈다(문제: 점선·열린 화살촉, 해결: 굵은 실선·채운 화살촉, 일반: 가는 실선).
 */
const TONE_VARS: Record<Tone, string> = {
	normal: '[--c:theme(colors.print-arrow)] [--w:1.25pt]',
	problem: '[--c:theme(colors.print-bad)] [--w:1.5pt]',
	fix: '[--c:theme(colors.print-accent)] [--w:1.75pt]',
};

const CHIP_TONE: Partial<Record<Tone, string>> = {
	problem: 'bg-white text-print-ink',
	fix: 'border-print-ink-2 bg-print-ink-2 text-white',
};

/** 화살촉 공통: 0 크기 상자의 테두리로 삼각형을 그린다. 방향에 따라 변과 이동을 달리한다. */
const HEAD_BASE = 'absolute h-0 w-0';
const HEAD_FILLED_RIGHT =
	'-translate-x-full -translate-y-1/2 border-y-[3.5pt] border-l-[7pt] border-y-transparent border-l-[color:var(--c)]';
const HEAD_FILLED_LEFT =
	'-translate-y-1/2 border-y-[3.5pt] border-r-[7pt] border-y-transparent border-r-[color:var(--c)]';
/** 문제 화살촉은 열린 V 모양: 5pt 정사각형의 위·오른쪽 테두리만 그리고 돌린다. */
const HEAD_OPEN = 'h-[5pt] w-[5pt] border-[color:var(--c)] border-r-[length:var(--w)] border-t-[length:var(--w)]';
const HEAD_OPEN_RIGHT = '-translate-x-full -translate-y-1/2 rotate-45';
const HEAD_OPEN_LEFT = '-translate-y-1/2 rotate-[-135deg]';

const getHeadClass = (tone: Tone, rightward: boolean) => {
	if (tone === 'problem') return cn(HEAD_BASE, HEAD_OPEN, rightward ? HEAD_OPEN_RIGHT : HEAD_OPEN_LEFT);

	return cn(HEAD_BASE, rightward ? HEAD_FILLED_RIGHT : HEAD_FILLED_LEFT);
};

/**
 * 인쇄용 시퀀스 도식. 흑백으로 뽑아도 구분되도록 선 모양으로 뜻을 나눈다.
 * 서버 컴포넌트이고 등장 효과가 없다.
 */
const PrintDiagram = ({ diagram }: { diagram: SequenceDiagram }) => {
	const { actors, steps } = diagram;
	const count = actors.length;
	const columns = { gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` };

	return (
		<figure className="mb-0 mt-[3mm] break-inside-avoid overflow-visible" data-testid="sequence-diagram">
			<div aria-hidden="true" className="border-[0.75pt] border-print-rule bg-white px-[3mm] pb-[3mm] pt-[4mm]">
				<div className="grid" style={columns}>
					{actors.map(actor => (
						<span
							key={actor}
							className="justify-self-center rounded-[1mm] border-[0.75pt] border-print-ink bg-white px-[2.5mm] py-[0.5mm] text-center text-[9pt] font-bold text-print-ink">
							{actor}
						</span>
					))}
				</div>
				<div className="relative mt-[2mm]">
					{actors.map((actor, index) => (
						<span
							key={actor}
							className="absolute inset-y-0 w-[0.75pt] -translate-x-1/2 [background:repeating-linear-gradient(180deg,theme(colors.print-dash)_0_2pt,transparent_2pt_4pt)]"
							style={{ left: centerOf(count, index) }}
						/>
					))}
					<ol className="relative">
						{steps.map((step, index) => {
							const tone = getTone(step);
							const { start, end, rightward, self } = getLabelSpan(count, step);
							const low = Math.min(step.from, step.to);
							const high = Math.max(step.from, step.to);
							const chip = TONE_LABEL[tone];
							// 자기 자신에게 보내는 메시지의 고리는 왼쪽을 향해 되돌아온다.
							const head = getHeadClass(tone, rightward && !self);

							return (
								<li
									key={`${step.label}-${index}`}
									className={cn('py-[1.5mm]', TONE_VARS[tone])}
									data-testid="sequence-step">
									<div className="grid" style={columns}>
										<p
											className={cn(
												'relative z-[1] text-[8.5pt] text-print-ink-2',
												self || rightward ? 'text-left' : 'text-right',
											)}
											style={{ gridColumn: `${start + 1} / ${end + 2}` }}>
											<span className="bg-white box-decoration-clone">
												{chip && (
													<span
														className={cn(
															'mr-[1.5mm] inline-block rounded-[1mm] border-[0.75pt] border-print-ink px-[1.5mm] text-[8pt] font-bold leading-[1.4]',
															CHIP_TONE[tone],
														)}>
														{chip}
													</span>
												)}
												{step.label}
											</span>
										</p>
									</div>
									<span className="relative mt-[0.5mm] block h-[4mm]">
										{self ? (
											<>
												<span
													className={cn(
														'absolute top-0 h-full w-[8mm] rounded-r-[2mm] border-[length:var(--w)] border-l-0 border-[color:var(--c)]',
														tone === 'problem' && 'border-dashed',
													)}
													style={{ left: centerOf(count, step.from) }}
												/>
												<span className={cn(head, 'top-full')} style={{ left: centerOf(count, step.from) }} />
											</>
										) : (
											<>
												<span
													className={cn(
														'absolute top-1/2 h-[var(--w)] -translate-y-1/2',
														tone === 'problem'
															? '[background:repeating-linear-gradient(90deg,var(--c)_0_5pt,transparent_5pt_8pt)]'
															: 'bg-[color:var(--c)]',
													)}
													style={{
														left: centerOf(count, low),
														width: `calc(${centerOf(count, high)} - ${centerOf(count, low)})`,
													}}
												/>
												<span
													className={cn(head, 'top-1/2')}
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

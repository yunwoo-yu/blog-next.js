import type { SequenceDiagram as SequenceDiagramData } from '@/portfolio/stories';
import { cn } from '@/utils/utils';
import DiagramReadout from './DiagramReadout';
import { centerOf, getLabelSpan, getTone, TONE_LABEL, type Tone } from './diagram';
import Reveal from './Reveal';

const TONE_TEXT: Record<Tone, string> = {
	normal: 'text-pf-gray-700',
	problem: 'text-red-700',
	fix: 'text-pf-blue-700',
};
const TONE_LINE: Record<Tone, string> = {
	normal: 'bg-pf-gray-400',
	problem: 'bg-red-600',
	fix: 'bg-pf-blue',
};
const HEAD_RIGHT: Record<Tone, string> = {
	normal: 'border-l-[8px] border-l-pf-gray-400',
	problem: 'border-l-[8px] border-l-red-600',
	fix: 'border-l-[8px] border-l-pf-blue',
};
const HEAD_LEFT: Record<Tone, string> = {
	normal: 'border-r-[8px] border-r-pf-gray-400',
	problem: 'border-r-[8px] border-r-red-600',
	fix: 'border-r-[8px] border-r-pf-blue',
};
const LOOP: Record<Tone, string> = {
	normal: 'border-pf-gray-400',
	problem: 'border-red-600',
	fix: 'border-pf-blue',
};
const TONE_PILL: Record<Tone, string> = {
	normal: '',
	problem: 'bg-red-50 text-red-700',
	fix: 'bg-pf-blue-50 text-pf-blue-700',
};

/**
 * 누가 누구에게 무엇을 보내는지 보여 주는 시퀀스 도식. 순수 CSS 라 서버에서 그린다.
 * 라벨은 줄바꿈되고 행 높이가 따라 늘어나므로 좁은 화면에서도 겹치지 않는다.
 * 보이는 도식은 보조기기에서 숨기고 같은 내용을 순서 목록으로 따로 준다.
 */
const SequenceDiagram = ({ diagram }: { diagram: SequenceDiagramData }) => {
	const { actors, steps, caption } = diagram;
	const count = actors.length;
	const center = (index: number) => centerOf(count, index);

	return (
		<figure className="mt-5">
			{caption && (
				<figcaption className="mb-2 break-keep text-[14px] font-bold leading-[1.5] text-pf-gray-700">
					{caption}
				</figcaption>
			)}
			<Reveal>
				<div
					data-testid="sequence-diagram"
					aria-hidden="true"
					className="rounded-2xl border border-pf-line bg-white px-2 pb-4 pt-3 sm:px-4">
					<div className="relative">
						<div className="relative z-10 grid" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
							{actors.map(actor => (
								<div key={actor} className="flex justify-center px-1">
									<span className="break-keep rounded-lg bg-pf-gray-100 px-2.5 py-1 text-center text-[13px] font-bold leading-[1.4] text-pf-gray-900">
										{actor}
									</span>
								</div>
							))}
						</div>
						{actors.map((actor, index) => (
							<span
								key={actor}
								className="absolute bottom-0 top-9 w-0 -translate-x-px border-l-2 border-dotted border-pf-gray-400"
								style={{ left: center(index) }}
							/>
						))}
						<ol className="relative mt-3">
							{steps.map((step, index) => {
								const tone = getTone(step);
								const { start, end, rightward, self } = getLabelSpan(count, step);
								const low = Math.min(step.from, step.to);
								const high = Math.max(step.from, step.to);

								return (
									<li key={`${step.label}-${index}`} data-testid="sequence-step" className="relative py-2.5">
										<div className="grid" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
											<p
												className={cn(
													'relative z-10 px-1 text-[13px] leading-[1.55]',
													rightward ? 'text-left' : 'text-right',
												)}
												style={{ gridColumn: `${start + 1} / ${end + 2}`, textAlign: self ? 'left' : undefined }}>
												<span className="break-keep bg-white box-decoration-clone">
													{TONE_LABEL[tone] && (
														<span className={cn('mr-1.5 rounded px-1.5 py-0.5 text-[12px] font-bold', TONE_PILL[tone])}>
															{TONE_LABEL[tone]}
														</span>
													)}
													<span className={cn('font-medium', TONE_TEXT[tone])}>{step.label}</span>
												</span>
											</p>
										</div>
										<div className="relative mt-1.5 h-3">
											{self ? (
												<span
													className={cn('absolute top-0 h-3 w-5 rounded-r-lg border-2 border-l-0', LOOP[tone])}
													style={{ left: center(step.from) }}
												/>
											) : (
												<>
													<span
														className={cn('absolute top-1/2 h-0.5 -translate-y-1/2', TONE_LINE[tone])}
														style={{ left: center(low), width: `calc(${center(high)} - ${center(low)})` }}
													/>
													<span
														className={cn(
															'absolute top-1/2 size-0 -translate-y-1/2 border-y-[5px] border-y-transparent',
															rightward ? HEAD_RIGHT[tone] : HEAD_LEFT[tone],
														)}
														style={rightward ? { left: `calc(${center(high)} - 8px)` } : { left: center(low) }}
													/>
												</>
											)}
										</div>
									</li>
								);
							})}
						</ol>
					</div>
				</div>
			</Reveal>
			<DiagramReadout diagram={diagram} />
		</figure>
	);
};

export default SequenceDiagram;

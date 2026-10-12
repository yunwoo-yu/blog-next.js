'use client';

import { type KeyboardEvent, useId, useRef, useState } from 'react';

import useReducedMotion from '@/hooks/useReducedMotion';
import {
	clampPhase,
	type Exhibit,
	getNodeLabel,
	getNodeState,
	getStageScreen,
	getVariantName,
	getVariants,
	LAST_PHASE,
	NODE_STATE_GLYPHS,
	NODE_STATE_LABELS,
	PHASE_COUNT,
	type PhaseIndex,
	type Variant,
} from '@/portfolio/exhibits';
import { cn } from '@/utils/utils';

import FlowDiagram from './FlowDiagram';
import ScreenFrame from './ScreenFrame';
import ServiceStage from './ServiceStage';

interface ServiceExhibitProps {
	exhibit: Exhibit;
	/** 문서 구조에 맞는 제목 수준 */
	headingLevel?: 2 | 3;
	/** 제목(한 줄 요약)을 이 컴포넌트가 그릴지. 상세 페이지는 위쪽 요약에서 이미 보여 주므로 끈다. */
	showHeadline?: boolean;
	/** 첫 화면에 보이는 전시라면 이미지를 우선 로드한다 */
	priority?: boolean;
	onReload?: () => void;
}

const segmentStyle = (active: boolean) =>
	cn(
		'inline-flex min-h-10 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5A1F] motion-reduce:transition-none',
		active ? 'border-pf-ink bg-pf-ink text-pf-paper' : 'border-pf-ink/30 hover:border-pf-ink',
	);

const LEGEND: { glyph: string; label: string; className: string }[] = [
	{ glyph: '~', label: '임시·화면 계산', className: 'border-pf-cool' },
	{ glyph: '✓', label: '확정', className: 'border-pf-signal bg-pf-signal/20' },
	{ glyph: '✕', label: '문제 발생', className: 'border-pf-break bg-pf-break/20' },
	{ glyph: '…', label: '대기', className: 'border-dashed border-pf-ink/60' },
	{ glyph: '↺', label: '복구', className: 'border-pf-ok bg-pf-ok/20' },
];

/**
 * 한 사례의 구조도. 공개 화면(있을 때만), 평면 구조도, 선택형 3D 를 한 상태(전·후, 단계)로 묶는다.
 * 컨트롤은 일반 버튼이라 키보드로 모두 쓸 수 있고, 3D 가 없어도 같은 정보를 준다.
 * 문제·결정·결과 요약은 이 컴포넌트가 아니라 상세 페이지 위쪽(CaseBrief)이 맡는다.
 */
const ServiceExhibit = ({
	exhibit,
	headingLevel = 2,
	showHeadline = true,
	priority = false,
	onReload,
}: ServiceExhibitProps) => {
	const [variant, setVariant] = useState<Variant>('after');
	const [phase, setPhase] = useState<PhaseIndex>(0);
	const [exploded, setExploded] = useState(false);
	const reducedMotion = useReducedMotion();
	const id = useId();
	const phaseRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const Heading = `h${headingLevel}` as 'h2' | 'h3';

	const variants = getVariants(exhibit);
	const copy = exhibit.phases[variant][phase];
	const hasScreen = Boolean(getStageScreen(exhibit, variant));

	const move = (next: number) => {
		const target = clampPhase(next);
		setPhase(target);
		phaseRefs.current[target]?.focus();
	};

	const onPhaseKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
			event.preventDefault();
			move(phase + 1);
		} else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
			event.preventDefault();
			move(phase - 1);
		} else if (event.key === 'Home') {
			event.preventDefault();
			move(0);
		} else if (event.key === 'End') {
			event.preventDefault();
			move(LAST_PHASE);
		}
	};

	return (
		<section aria-labelledby={`${id}-title`} className="text-pf-ink" data-testid="service-exhibit">
			{showHeadline ? (
				<Heading id={`${id}-title`} className="break-keep text-2xl font-bold leading-tight tracking-tight md:text-4xl">
					{exhibit.headline}
				</Heading>
			) : (
				<span id={`${id}-title`} className="sr-only">
					{exhibit.headline}
				</span>
			)}

			<div
				className={cn('grid gap-5', showHeadline && 'mt-5', hasScreen && 'lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]')}>
				<ScreenFrame exhibit={exhibit} variant={variant} priority={priority} />

				<div className="min-w-0">
					<ServiceStage
						exhibit={exhibit}
						phase={phase}
						variant={variant}
						exploded={exploded}
						reducedMotion={reducedMotion}
						onToggleExploded={() => setExploded(value => !value)}
						onReload={onReload}
						poster={
							<div className="absolute inset-0 p-2" data-testid="flow-poster">
								<FlowDiagram exhibit={exhibit} variant={variant} phase={phase} exploded={exploded} />
							</div>
						}
					/>
					{/* 좁은 화면에서는 도식 글자가 작아지므로 같은 상태를 글로도 보여 준다. */}
					<ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs sm:hidden" aria-label="구성 요소 상태">
						{exhibit.nodes
							.filter(node => getNodeState(exhibit, variant, phase, node.id) !== 'idle')
							.map(node => {
								const state = getNodeState(exhibit, variant, phase, node.id);

								return (
									<li key={node.id}>
										<span aria-hidden="true" className="mr-1 font-mono">
											{NODE_STATE_GLYPHS[state]}
										</span>
										{getNodeLabel(node, variant)}
										<span className="text-pf-ink/60"> · {NODE_STATE_LABELS[state]}</span>
									</li>
								);
							})}
					</ul>
				</div>
			</div>

			<div className="mt-5 flex flex-col gap-3">
				<div className="flex flex-wrap items-center gap-x-5 gap-y-3">
					{variants.length > 1 && (
						<fieldset className="min-w-0 border-0 p-0">
							<legend className="sr-only">전·후 비교</legend>
							<div className="flex flex-wrap gap-2">
								{variants.map(value => (
									<label key={value} className="cursor-pointer">
										<input
											type="radio"
											name={`${id}-variant`}
											value={value}
											checked={variant === value}
											onChange={() => setVariant(value)}
											className="peer sr-only"
										/>
										<span
											className={cn(
												segmentStyle(variant === value),
												'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#FF5A1F]',
											)}>
											{getVariantName(exhibit, value)} · {exhibit.variantLabels[value]}
										</span>
									</label>
								))}
							</div>
						</fieldset>
					)}

					{/* biome-ignore lint/a11y/useSemanticElements: 버튼 묶음이며 화살표 키로 단계를 옮긴다. */}
					<div
						role="group"
						aria-label={`단계 ${phase + 1}/${PHASE_COUNT}`}
						onKeyDown={onPhaseKeyDown}
						className="flex flex-wrap gap-2">
						{exhibit.phases[variant].map((item, index) => (
							<button
								key={item.title}
								ref={node => {
									phaseRefs.current[index] = node;
								}}
								type="button"
								aria-current={index === phase ? 'step' : undefined}
								onClick={() => setPhase(clampPhase(index))}
								className={segmentStyle(index === phase)}>
								<span className="mr-1.5 font-mono text-xs opacity-70">{index + 1}</span>
								{item.title}
							</button>
						))}
					</div>
				</div>

				<p className="text-base leading-7" aria-live="polite" data-testid="phase-caption">
					<strong className="font-semibold">{copy.title}.</strong> {copy.caption}
				</p>

				<details className="text-xs text-pf-ink/70">
					<summary className="cursor-pointer underline underline-offset-2">범례</summary>
					<ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5" aria-label="도식 범례">
						{LEGEND.map(item => (
							<li key={item.label} className="flex items-center gap-1.5">
								<span
									aria-hidden="true"
									className={cn(
										'inline-flex size-5 items-center justify-center rounded border text-[11px]',
										item.className,
									)}>
									{item.glyph}
								</span>
								{item.label}
							</li>
						))}
					</ul>
				</details>
			</div>
		</section>
	);
};

export default ServiceExhibit;

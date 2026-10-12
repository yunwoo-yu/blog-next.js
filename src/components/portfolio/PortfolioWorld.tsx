'use client';

import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import {
	Component,
	lazy,
	type ReactNode,
	Suspense,
	useCallback,
	useEffect,
	useRef,
	useState,
	useSyncExternalStore,
} from 'react';

import useReducedMotion from '@/hooks/useReducedMotion';
import useScrollDirection from '@/hooks/useScrollDirection';
import {
	type Exhibit,
	getNodeLabel,
	getNodeState,
	getVariantName,
	getVariants,
	NODE_STATE_GLYPHS,
	NODE_STATE_LABELS,
	PHASE_COUNT,
} from '@/portfolio/exhibits';
import { buildCasePath } from '@/portfolio/links';
import { detectWebGL } from '@/portfolio/webgl-support';
import { computeWorldState, getPhaseScrollY, type SectionSpan } from '@/portfolio/world';
import { createWorldStore, type WorldStore } from '@/portfolio/world-store';
import { cn } from '@/utils/utils';

import ExhibitShowcase from './ExhibitShowcase';

const WorldCanvas = lazy(() => import('./WorldCanvas'));

type Mode = 'flat' | 'world';

const STORAGE_KEY = 'pf-world';
const CHAPTER_HEIGHT = 'h-[220svh]';

const readStored = () => {
	try {
		return window.localStorage.getItem(STORAGE_KEY);
	} catch {
		return null;
	}
};

const writeStored = (value: 'on' | 'off') => {
	try {
		window.localStorage.setItem(STORAGE_KEY, value);
	} catch {
		// 저장소가 막혀 있어도 이번 방문에는 동작한다.
	}
};

/** 3D 를 쓸 수 있는 환경인지. 움직임 줄이기·데이터 절약·WebGL2 없음·사용자가 끈 경우는 평면으로 둔다. */
const canUseWorld = () => {
	if (readStored() === 'off') return false;
	if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
	if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return false;

	return detectWebGL();
};

/** 청크 로드 실패·렌더 오류가 나면 월드를 포기하고 평면으로 돌아간다. */
class WorldBoundary extends Component<{ onFail: () => void; children: ReactNode }, { failed: boolean }> {
	state = { failed: false };

	static getDerivedStateFromError() {
		return { failed: true };
	}

	componentDidCatch() {
		this.props.onFail();
	}

	render() {
		return this.state.failed ? null : this.props.children;
	}
}

const buttonStyle =
	'inline-flex min-h-9 items-center justify-center rounded-md border px-3 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5A1F] motion-reduce:transition-none';

const segmentStyle = (active: boolean) =>
	cn(buttonStyle, active ? 'border-pf-ink bg-pf-ink text-pf-paper' : 'border-pf-ink/30 hover:border-pf-ink');

export interface CaseMeta {
	slug: string;
	organization: string;
	period?: string;
}

/** 조직별로 묶은 사례 목록. 같은 조직이 이어지는 순서 그대로 묶는다. */
const groupByOrganization = (exhibits: Exhibit[], metas: CaseMeta[]) => {
	const groups: { organization: string; items: { exhibit: Exhibit; index: number }[] }[] = [];

	exhibits.forEach((exhibit, index) => {
		const organization = metas.find(meta => meta.slug === exhibit.slug)?.organization ?? '';
		const last = groups[groups.length - 1];

		if (last && last.organization === organization) last.items.push({ exhibit, index });
		else groups.push({ organization, items: [{ exhibit, index }] });
	});

	return groups;
};

interface CaseBarProps {
	exhibits: Exhibit[];
	metas: CaseMeta[];
	/** 현재 장(1부터). 전경이면 0 */
	section: number;
	onSelect: (index: number) => void;
}

/**
 * 어느 장면에서든 보이는 사례 선택 줄. 넓은 화면은 조직별 칩, 좁은 화면은 현재 사례를 보여 주는 펼침 목록이다.
 * 순서대로 스크롤해도 되고 여기서 골라 바로 가도 된다.
 */
const NAV_SELECTOR = 'nav[aria-label="포트폴리오 내비게이션"]';

/** 포트폴리오 내비는 좁은 화면에서 줄바꿈하므로 실제 높이를 재서 그 아래에 붙는다. */
const useNavHeight = () => {
	const [height, setHeight] = useState(44);

	useEffect(() => {
		const nav = document.querySelector(NAV_SELECTOR);

		if (!nav || typeof ResizeObserver === 'undefined') return;

		const update = () => setHeight(Math.round(nav.getBoundingClientRect().height));
		const observer = new ResizeObserver(update);

		update();
		observer.observe(nav);

		return () => observer.disconnect();
	}, []);

	return height;
};

const CaseBar = ({ exhibits, metas, section, onSelect }: CaseBarProps) => {
	const showHeader = useScrollDirection();
	const navHeight = useNavHeight();
	const groups = groupByOrganization(exhibits, metas);
	const current = section > 0 ? exhibits[section - 1] : undefined;

	return (
		<div
			className="sticky z-30 h-0 transition-[top] duration-300 motion-reduce:transition-none"
			style={{ top: showHeader ? `calc(var(--header-height) + ${navHeight}px)` : `${navHeight}px` }}>
			<nav
				aria-label="사례 선택"
				className="absolute inset-x-0 top-0 border-b border-pf-ink/15 bg-pf-paper/85 backdrop-blur-md">
				<div className="mx-auto hidden max-w-6xl flex-wrap items-center gap-x-5 gap-y-1 px-4 py-2 sm:px-6 lg:flex">
					{groups.map(group => (
						<div key={group.organization} className="flex flex-wrap items-center gap-1.5">
							<span className="mr-1 text-xs font-semibold text-pf-ink/55">{group.organization}</span>
							{group.items.map(({ exhibit, index }) => (
								<button
									key={exhibit.slug}
									type="button"
									aria-current={section === index + 1 ? 'true' : undefined}
									onClick={() => onSelect(index)}
									className={cn(
										'inline-flex h-7 items-center rounded-full border px-3 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5A1F] motion-reduce:transition-none',
										section === index + 1
											? 'border-pf-accent bg-pf-accent text-white'
											: 'border-pf-ink/25 hover:border-pf-ink',
									)}>
									{exhibit.shortTitle}
								</button>
							))}
						</div>
					))}
				</div>

				<details className="mx-auto max-w-6xl px-4 py-1.5 sm:px-6 lg:hidden">
					<summary className="flex h-8 cursor-pointer list-none items-center justify-between text-sm font-medium">
						<span>
							{current
								? `${String(section).padStart(2, '0')}/${String(exhibits.length).padStart(2, '0')} · ${current.shortTitle}`
								: `사례 ${exhibits.length}개 선택`}
						</span>
						<span aria-hidden="true">▾</span>
					</summary>
					<div className="max-h-[55svh] overflow-y-auto pb-2">
						{groups.map(group => (
							<div key={group.organization} className="mt-2">
								<p className="text-xs font-semibold text-pf-ink/55">{group.organization}</p>
								<ul className="mt-1 grid grid-cols-2 gap-1.5">
									{group.items.map(({ exhibit, index }) => (
										<li key={exhibit.slug}>
											<button
												type="button"
												aria-current={section === index + 1 ? 'true' : undefined}
												onClick={event => {
													onSelect(index);
													event.currentTarget.closest('details')?.removeAttribute('open');
												}}
												className={cn(
													'h-9 w-full rounded-md border px-2 text-left text-xs font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5A1F]',
													section === index + 1 ? 'border-pf-accent bg-pf-accent text-white' : 'border-pf-ink/25',
												)}>
												{exhibit.shortTitle}
											</button>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</details>
			</nav>
		</div>
	);
};

const WorldBar = ({ store, exhibits, metas, onSelect }: Omit<CaseBarProps, 'section'> & { store: WorldStore }) => {
	const view = useSyncExternalStore(store.subscribe, store.getView, store.getView);

	return <CaseBar exhibits={exhibits} metas={metas} section={view.section} onSelect={onSelect} />;
};

interface ChapterProps {
	exhibit: Exhibit;
	index: number;
	total: number;
	meta?: CaseMeta;
	store: WorldStore;
	onJump: (index: number, phase: number) => void;
}

/**
 * 한 사례의 장. 카드는 한 줄 요약, 지금 단계, 전·후, 결과 한 줄, 상세 링크만 둔다.
 * 문제·결정 같은 설명은 상세 페이지가 맡는다(3D 와 같은 화면에서 읽을 양이 아니다).
 */
const Chapter = ({ exhibit, index, total, meta, store, onJump }: ChapterProps) => {
	const view = useSyncExternalStore(store.subscribe, store.getView, store.getView);
	const chapter = index + 1;
	const variant = view.variants[index];
	const variants = getVariants(exhibit);
	const phase = view.section > chapter ? PHASE_COUNT - 1 : view.section < chapter ? 0 : view.phase;
	const copy = exhibit.phases[variant][phase];
	const shown = exhibit.nodes
		.map(node => ({ node, state: getNodeState(exhibit, variant, phase, node.id) }))
		.filter(({ state }) => state !== 'idle');

	return (
		<section
			id={index === 0 ? 'world-start' : undefined}
			aria-labelledby={`world-${exhibit.slug}`}
			className={cn(CHAPTER_HEIGHT, 'relative')}>
			<div className="sticky top-0 flex h-[100svh] items-end px-4 pb-6 pt-28 sm:px-6 md:items-center md:pb-0">
				<div className="mx-auto w-full max-w-6xl">
					<div className="w-full rounded-xl border border-pf-ink/25 bg-pf-paper/90 p-4 shadow-[0_24px_60px_-32px_rgba(20,22,26,0.55)] backdrop-blur-md md:max-w-[22rem] md:p-5">
						<p className="font-mono text-[11px] uppercase tracking-[0.12em] text-pf-ink/60">
							{String(chapter).padStart(2, '0')} / {String(total).padStart(2, '0')}
							{meta?.organization ? ` · ${meta.organization}` : ''}
						</p>
						<h3
							id={`world-${exhibit.slug}`}
							className="mt-2 break-keep text-xl font-bold leading-tight tracking-tight md:text-2xl">
							{exhibit.headline}
						</h3>

						<p className="mt-3 min-h-[3.5rem] text-sm leading-6" data-testid="world-caption">
							<strong className="font-semibold">{copy.title}.</strong> {copy.caption}
						</p>

						<fieldset className="mt-3 flex min-w-0 items-center gap-1.5 border-0 p-0">
							<legend className="sr-only">단계 이동</legend>
							{exhibit.phases[variant].map((item, step) => (
								<button
									key={item.title}
									type="button"
									aria-current={step === phase ? 'step' : undefined}
									aria-label={`${step + 1}단계 ${item.title}`}
									onClick={() => onJump(index, step)}
									className="group flex h-6 flex-1 items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5A1F]">
									<span
										className={cn(
											'block h-1.5 w-full rounded-full transition-colors motion-reduce:transition-none',
											step <= phase ? 'bg-pf-accent' : 'bg-pf-ink/20 group-hover:bg-pf-ink/40',
										)}
									/>
								</button>
							))}
						</fieldset>

						{variants.length > 1 && (
							<fieldset className="mt-3 flex min-w-0 gap-1.5 border-0 p-0">
								<legend className="sr-only">전·후 비교</legend>
								{variants.map(value => (
									<button
										key={value}
										type="button"
										aria-pressed={variant === value}
										onClick={() => store.setVariant(index, value)}
										className={segmentStyle(variant === value)}>
										{getVariantName(exhibit, value)}
									</button>
								))}
							</fieldset>
						)}

						<p className="mt-4 border-t border-pf-ink/15 pt-3 text-sm leading-6">
							<span className="mr-1.5 text-xs font-semibold text-pf-accent-text">결과</span>
							{exhibit.callouts.outcome}
						</p>

						{/* 3D 는 장식이므로 같은 상태를 글로도 준다. 스크린리더와 3D 를 못 쓰는 환경을 위한 목록. */}
						<ul className="sr-only" aria-label="구성 요소 상태">
							{shown.map(({ node, state }) => (
								<li key={node.id}>
									{NODE_STATE_GLYPHS[state]} {getNodeLabel(node, variant)} · {NODE_STATE_LABELS[state]}
								</li>
							))}
						</ul>

						<Link
							href={buildCasePath(exhibit.slug)}
							className="mt-3 inline-flex items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5A1F]">
							판단과 문제 해결 보기
							<ArrowUpRight size={14} aria-hidden="true" />
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
};

interface PortfolioWorldProps {
	exhibits: Exhibit[];
	metas: CaseMeta[];
	/** 서버에서 렌더한 소개 영역. 월드에서는 전경 위에, 평면에서는 전시 위에 놓인다. */
	children: ReactNode;
}

/**
 * 페이지 전체가 3D 인 스크롤 월드. 서버·JS 없음·움직임 줄이기·WebGL 없음에서는 같은 소개 + 평면 전시로 보인다.
 * 월드에서는 사례마다 디오라마가 가로로 놓이고, 스크롤이 카메라와 단계(phase)를 함께 움직인다.
 */
const PortfolioWorld = ({ exhibits, metas, children }: PortfolioWorldProps) => {
	const [mode, setMode] = useState<Mode>('flat');
	const reducedMotion = useReducedMotion();
	const [canvasEnabled, setCanvasEnabled] = useState(false);
	const [ready, setReady] = useState(false);
	const rootRef = useRef<HTMLDivElement>(null);
	const spansRef = useRef<{ top: number; spans: SectionSpan[]; viewport: number }>({
		top: 0,
		spans: [],
		viewport: 800,
	});
	const [store] = useState(() => createWorldStore(exhibits.length));

	useEffect(() => {
		if (canUseWorld()) setMode('world');
	}, []);

	// 첫 화면(소개 글)을 먼저 그리고, 한가할 때 3D 청크를 받는다.
	useEffect(() => {
		if (mode !== 'world') return;

		const enable = () => setCanvasEnabled(true);

		if (typeof window.requestIdleCallback === 'function') {
			const handle = window.requestIdleCallback(enable, { timeout: 1500 });

			return () => window.cancelIdleCallback(handle);
		}

		const timer = window.setTimeout(enable, 300);

		return () => window.clearTimeout(timer);
	}, [mode]);

	// 스크롤 → 월드 상태. React 상태는 장·단계가 바뀔 때만 갱신된다.
	useEffect(() => {
		const root = rootRef.current;

		if (mode !== 'world' || !root) return;

		let frame = 0;
		let visible = true;

		const measure = () => {
			const rootTop = root.getBoundingClientRect().top + window.scrollY;
			const sections = Array.from(root.querySelectorAll<HTMLElement>('[data-world-section]'));

			spansRef.current = {
				top: rootTop,
				viewport: window.innerHeight,
				spans: sections.map(section => {
					const rect = section.getBoundingClientRect();

					return { top: rect.top + window.scrollY - rootTop, height: rect.height };
				}),
			};
		};

		const update = () => {
			frame = 0;

			const { top, spans, viewport } = spansRef.current;

			// 레이아웃이 아직 없으면(높이 0) 모든 섹션이 맨 위에 겹쳐 마지막 장으로 오판한다.
			if (!visible || spans.every(span => span.height === 0)) return;

			store.applyScroll(computeWorldState(window.scrollY - top, spans, viewport));
		};

		const schedule = () => {
			if (frame === 0) frame = window.requestAnimationFrame(update);
		};

		const onResize = () => {
			measure();
			schedule();
		};

		measure();
		update();

		// 둘 다 없는 환경에서도 스크롤·리사이즈 이벤트만으로 동작한다.
		const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(onResize);
		observer?.observe(root);
		const visibility =
			typeof IntersectionObserver === 'undefined'
				? null
				: new IntersectionObserver(
						([entry]) => {
							visible = entry.isIntersecting;
							if (visible) schedule();
						},
						{ rootMargin: '200px 0px' },
					);
		visibility?.observe(root);
		window.addEventListener('scroll', schedule, { passive: true });
		window.addEventListener('resize', onResize);

		return () => {
			window.cancelAnimationFrame(frame);
			observer?.disconnect();
			visibility?.disconnect();
			window.removeEventListener('scroll', schedule);
			window.removeEventListener('resize', onResize);
		};
	}, [mode, store]);

	// 마우스가 있는 기기에서만 디오라마가 살짝 기운다. 터치는 스크롤을 방해하지 않는다.
	useEffect(() => {
		if (mode !== 'world' || !window.matchMedia?.('(hover: hover) and (pointer: fine)').matches) return;

		const onMove = (event: PointerEvent) => {
			store.setPointer((event.clientX / window.innerWidth) * 2 - 1, (event.clientY / window.innerHeight) * 2 - 1);
		};

		window.addEventListener('pointermove', onMove, { passive: true });

		return () => window.removeEventListener('pointermove', onMove);
	}, [mode, store]);

	const jump = useCallback(
		(index: number, phase: number) => {
			const { top, spans, viewport } = spansRef.current;
			const span = spans[index + 1];

			if (!span) return;

			window.scrollTo({
				top: top + getPhaseScrollY(span, viewport, phase),
				behavior: reducedMotion ? 'auto' : 'smooth',
			});
		},
		[reducedMotion],
	);

	const fallBack = useCallback(() => {
		setMode('flat');
		setReady(false);
		setCanvasEnabled(false);
	}, []);

	// 방문 중에 "움직임 줄이기"가 켜지면 월드를 접고 평면 전시로 돌아간다.
	useEffect(() => {
		if (reducedMotion) fallBack();
	}, [reducedMotion, fallBack]);

	const turnOff = () => {
		writeStored('off');
		fallBack();
	};

	const turnOn = () => {
		writeStored('on');
		if (detectWebGL()) setMode('world');
	};

	if (mode === 'flat') {
		return (
			<div id="exhibit" ref={rootRef}>
				{children}
				<section
					id="world-start"
					aria-label="대표 전시"
					className="mx-auto max-w-6xl scroll-mt-32 px-4 py-12 sm:px-6 md:py-16">
					<ExhibitShowcase />
					{readStored() === 'off' && (
						<button type="button" onClick={turnOn} className={cn(segmentStyle(false), 'mt-6')}>
							3D 월드로 보기
						</button>
					)}
				</section>
			</div>
		);
	}

	return (
		<div id="exhibit" ref={rootRef} data-testid="portfolio-world" className="relative">
			<WorldBar store={store} exhibits={exhibits} metas={metas} onSelect={index => jump(index, 0)} />
			<div
				className={cn(
					'sticky top-0 h-[100svh] transition-opacity duration-700 motion-reduce:transition-none',
					ready ? 'opacity-100' : 'opacity-0',
				)}
				data-testid="world-canvas">
				{canvasEnabled && (
					<WorldBoundary onFail={fallBack}>
						<Suspense fallback={null}>
							<WorldCanvas
								exhibits={exhibits}
								store={store}
								reducedMotion={false}
								onReady={() => setReady(true)}
								onContextLost={fallBack}
							/>
						</Suspense>
					</WorldBoundary>
				)}
			</div>

			<div className="relative z-10 -mt-[100svh]">
				<div data-world-section="hero" className="relative h-[170svh]">
					<div className="sticky top-0 flex h-[100svh] flex-col justify-center">
						{/* 좁은 화면에서는 3D 가 글 뒤로 깔리므로 종이색 막을 한 겹 깔아 읽히게 한다. */}
						<div className="bg-pf-paper/80 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none">{children}</div>
						<p className="px-4 pt-2 text-center font-mono text-xs text-pf-ink/60 sm:px-6">
							아래로 스크롤하면 카메라가 사례 사이를 지나갑니다 ↓
						</p>
					</div>
				</div>
				{exhibits.map((exhibit, index) => (
					<div key={exhibit.slug} data-world-section={exhibit.slug}>
						<Chapter
							exhibit={exhibit}
							index={index}
							total={exhibits.length}
							meta={metas.find(meta => meta.slug === exhibit.slug)}
							store={store}
							onJump={jump}
						/>
					</div>
				))}
			</div>

			<div className="relative z-10 flex justify-center pb-6 pt-2">
				<button type="button" onClick={turnOff} className={segmentStyle(false)}>
					3D 끄고 평면으로 보기
				</button>
			</div>
		</div>
	);
};

export default PortfolioWorld;

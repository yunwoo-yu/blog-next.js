import Link from 'next/link';
import type { ReactNode } from 'react';

import { renderHighlightedText } from '@/components/resume/Careers';
import { buildCasePath, getAdjacentCases, type PortfolioCase } from '@/portfolio/cases';
import { getExhibit } from '@/portfolio/exhibits';
import { getStory } from '@/portfolio/stories';

import CaseStory, { getVisibleStory } from './CaseStory';
import PortfolioNav from './PortfolioNav';
import ServiceExhibit from './ServiceExhibit';

interface CaseStudyProps {
	item: PortfolioCase;
	/** 이력서 기록 뒤, 이전/다음 사례 앞에 들어가는 보조 영역. */
	children?: ReactNode;
}

/** 실제로 렌더되는 섹션만 내비에 올린다. 없는 앵커로 가는 죽은 링크를 만들지 않는다. */
const buildSections = (parts: { decisions: boolean; troubles: boolean; screens: boolean }) => [
	{ id: 'exhibit', label: '구조' },
	...(parts.decisions ? [{ id: 'decisions', label: '판단' }] : []),
	...(parts.troubles ? [{ id: 'troubles', label: '해결' }] : []),
	...(parts.screens ? [{ id: 'screens', label: '화면' }] : []),
	{ id: 'record', label: '이력서 원문' },
];

const BRIEF_ROWS = [
	{ key: 'problem', label: '문제' },
	{ key: 'decision', label: '결정' },
	{ key: 'outcome', label: '결과' },
] as const;

const CaseStudy = ({ item, children }: CaseStudyProps) => {
	const { prev, next } = getAdjacentCases(item.slug);
	const exhibit = getExhibit(item.slug);
	const story = getStory(item.slug);
	const visible = getVisibleStory(story);
	const sections = buildSections({
		decisions: visible.decisions.length > 0,
		troubles: visible.troubles.length > 0,
		screens: Boolean(exhibit?.gallery?.length),
	});

	return (
		<div>
			<PortfolioNav sections={sections} showBackLink />
			<article className="mx-auto max-w-4xl px-4 pb-16 pt-8 sm:px-6 md:pt-12">
				<header>
					<p className="text-sm text-pf-ink/65">
						{item.organization} · {item.service}
						{item.period && ` · ${item.period}`}
					</p>
					<h2 className="mt-3 break-keep text-3xl font-bold leading-tight tracking-tight md:text-5xl">
						{exhibit?.headline ?? item.title}
					</h2>
					<p className="mt-3 text-base text-pf-ink/70">{item.title}</p>
				</header>

				{exhibit && (
					<section aria-label="요약" className="mt-8 rounded-xl border border-pf-ink/20 bg-pf-ink/[0.03] p-5 md:p-6">
						<p className="text-sm leading-6 text-pf-ink/70">{exhibit.callouts.role}</p>
						<dl className="mt-4 grid gap-5 md:grid-cols-3 md:gap-6">
							{BRIEF_ROWS.map(row => (
								<div key={row.key}>
									<dt
										className={
											row.key === 'outcome'
												? 'text-xs font-semibold text-pf-accent-text'
												: 'text-xs font-semibold text-pf-ink/60'
										}>
										{row.label}
									</dt>
									<dd className="mt-1 text-base leading-7">{exhibit.callouts[row.key]}</dd>
								</div>
							))}
						</dl>
						<p className="mt-4 text-xs leading-5 text-pf-ink/60">결과 근거: {exhibit.callouts.outcomeBasis}</p>
					</section>
				)}

				<div id="exhibit" className="mt-12 scroll-mt-32">
					<h3 className="text-xl font-bold md:text-2xl">구조</h3>
					<div className="mt-4">{exhibit && <ServiceExhibit exhibit={exhibit} showHeadline={false} priority />}</div>
					{exhibit && !exhibit.screens.before && !exhibit.screens.after && !exhibit.identity && (
						<p className="mt-3 text-xs leading-5 text-pf-ink/60">{exhibit.reconstructionNote}</p>
					)}
				</div>

				{story && <CaseStory story={story} exhibit={exhibit} />}

				<details id="record" className="mt-14 scroll-mt-32 border-t border-pf-ink/20 pt-5">
					<summary className="cursor-pointer text-xl font-bold">이력서 원문</summary>
					<p className="mt-3 text-sm leading-6 text-pf-ink/70">{item.summary}</p>
					<ol className="mt-5 grid gap-4 md:grid-cols-3">
						{item.stages.map(stage => (
							<li key={stage.id} className="border-t-2 border-pf-ink/80 pt-3">
								<section id={stage.id} aria-labelledby={`${stage.id}-title`} className="scroll-mt-32">
									<h4 id={`${stage.id}-title`} className="text-sm font-bold">
										{stage.label}
									</h4>
									<p className="mt-2 text-sm leading-7">
										{renderHighlightedText(stage.text, stage.highlights)}
										{stage.links.map(link => (
											<a
												key={link.url}
												href={link.url}
												target="_blank"
												rel="noopener noreferrer"
												className="ml-1 text-destructive underline-offset-2 hover:underline">
												[{link.title}]
											</a>
										))}
									</p>
								</section>
							</li>
						))}
					</ol>
				</details>

				{children}

				{(prev || next) && (
					<nav aria-label="다른 사례" className="mt-14 grid gap-3 border-t border-pf-ink/20 pt-6 sm:grid-cols-2">
						{prev ? (
							<Link
								href={buildCasePath(prev.slug)}
								className="rounded-lg border border-pf-ink/25 p-4 hover:border-pf-signal">
								<span className="block text-xs text-pf-ink/60">이전 사례</span>
								<span className="mt-1 block text-sm font-medium">{prev.title}</span>
							</Link>
						) : (
							<span />
						)}
						{next && (
							<Link
								href={buildCasePath(next.slug)}
								className="rounded-lg border border-pf-ink/25 p-4 hover:border-pf-signal sm:text-right">
								<span className="block text-xs text-pf-ink/60">다음 사례</span>
								<span className="mt-1 block text-sm font-medium">{next.title}</span>
							</Link>
						)}
					</nav>
				)}
			</article>
		</div>
	);
};

export default CaseStudy;
